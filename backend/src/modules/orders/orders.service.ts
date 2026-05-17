import mongoose, { Types } from 'mongoose';
import { OrderModel } from './orders.model';
import { Cart } from '../cart/cart.model';
import { MenuItem } from '../menu/menu.model';
import { OrderStatus, PaymentStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { PlaceOrderInput } from './orders.schema';
import { socketService } from '../../sockets/socket.service';
import { InventoryService } from '../inventory/inventory.service';
import { SocketEvent } from '../../constants/events';

/**
 * Requirement #1: Strict Order State Machine Rules
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PLACED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED, OrderStatus.REJECTED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED, OrderStatus.DELAYED],
  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.DELAYED],
  [OrderStatus.READY]: [OrderStatus.PICKED, OrderStatus.DELAYED],
  [OrderStatus.PICKED]: [OrderStatus.SERVED],
  [OrderStatus.SERVED]: [OrderStatus.COMPLETED],
  [OrderStatus.DELAYED]: [OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REJECTED]: [],
  [OrderStatus.COMPLETED]: [],
};

export class OrdersService {
  /**
   * Helper to validate state transitions (Requirement #1)
   * and ensure idempotency (Requirement #2)
   */
  private static validateTransition(current: OrderStatus, next: OrderStatus) {
    if (current === next) return; // Idempotent: already in target state

    const allowed = ALLOWED_TRANSITIONS[current] || [];
    if (!allowed.includes(next)) {
      throw new AppError(
        `Invalid transition from ${current} to ${next}`,
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }
  }

  /**
   * Requirement #3: Ownership Validation Helper
   */
  private static async getOrderAndVerifyOwnership(
    orderId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId
  ) {
    const order = await OrderModel.findOne({ _id: orderId, restaurantId });
    if (!order) {
      throw new AppError('Order not found or access denied', 404, ErrorCode.NOT_FOUND);
    }
    return order;
  }

  /**
   * Requirement #5: Place Order with Transaction support
   */
  static async placeOrder(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    tableId: string | Types.ObjectId,
    data: PlaceOrderInput
  ) {
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      // 1. Fetch Cart
      const cart = await Cart.findOne({ restaurantId, sessionId }).session(mongoSession).populate('items.menuItem');

      if (!cart || cart.items.length === 0) {
        throw new AppError('Cart is empty or not found', 400, ErrorCode.VALIDATION_ERROR);
      }

      // Idempotency Check (Requirement #2): Prevent duplicate orders for the same session within 5 seconds
      const recentOrder = await OrderModel.findOne({
        sessionId,
        createdAt: { $gte: new Date(Date.now() - 5000) },
      }).session(mongoSession);

      if (recentOrder) {
        return recentOrder; // Return the existing order instead of creating a new one
      }

      // 2. Snapshot pricing (Requirement #6)
      const orderItems = cart.items.map((item: any) => {
        if (!item.menuItem) {
          throw new AppError('Invalid menu item in cart', 400, ErrorCode.VALIDATION_ERROR);
        }
        return {
          menuItemId: item.menuItem._id,
          name: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          tax: (item.subtotal * 0.05), // Example tax logic, should be centralized
          discount: 0,
          grandTotal: item.subtotal + (item.subtotal * 0.05),
          notes: item.notes || '',
        };
      });

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // 3. Create Order
      const order = await OrderModel.create(
        [
          {
            restaurantId,
            tableId,
            sessionId,
            orderNumber,
            items: orderItems,
            totalAmount: cart.subtotal,
            taxAmount: cart.subtotal * 0.05,
            discountAmount: 0,
            finalAmount: cart.subtotal * 1.05,
            status: OrderStatus.PLACED,
            paymentStatus: PaymentStatus.PENDING,
            specialInstructions: data.specialInstructions,
          },
        ],
        { session: mongoSession }
      );

      // 4. Clear Cart
      cart.items = [] as any;
      cart.subtotal = 0;
      cart.grandTotal = 0;
      await cart.save({ session: mongoSession });

      await mongoSession.commitTransaction();
      
      // Notify (Requirement #9: Real-time Integration)
      socketService.emitToRestaurant(restaurantId.toString(), SocketEvent.ORDER_NEW, order[0]);

      return order[0];
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      mongoSession.endSession();
    }
  }

  /**
   * Requirement #4: Safe Reorder Logic
   */
  static async reorder(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    orderId: string | Types.ObjectId
  ) {
    const oldOrder = await this.getOrderAndVerifyOwnership(orderId, restaurantId);
    
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      const cart = await Cart.findOne({ restaurantId, sessionId }).session(mongoSession);
      if (!cart) throw new AppError('Active session cart not found', 404, ErrorCode.NOT_FOUND);

      const reorderResults = {
        successCount: 0,
        skippedItems: [] as string[],
      };

      for (const item of oldOrder.items) {
        // Check if item still exists and is available
        const menuItem = await MenuItem.findOne({ _id: item.menuItemId, restaurantId, isAvailable: true }).session(mongoSession);
        
        if (!menuItem) {
          reorderResults.skippedItems.push(item.name);
          continue;
        }

        // Add to cart with LATEST pricing (not old snapshot)
        // This logic would normally call CartService.addItem, but we implement it here for transaction safety
        const existingItem = cart.items.find(i => i.menuItem.toString() === menuItem._id.toString());
        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.subtotal = existingItem.quantity * menuItem.price;
        } else {
          cart.items.push({
            menuItem: menuItem._id,
            quantity: item.quantity,
            unitPrice: menuItem.price,
            subtotal: item.quantity * menuItem.price,
            notes: `Reordered from ${oldOrder.orderNumber}`,
          } as any);
        }
        reorderResults.successCount++;
      }

      if (reorderResults.successCount === 0) {
        throw new AppError('None of the items from the previous order are currently available', 400, ErrorCode.VALIDATION_ERROR);
      }

      // Recalculate cart totals
      cart.subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
      cart.grandTotal = cart.subtotal; // Simplify for now
      await cart.save({ session: mongoSession });

      await mongoSession.commitTransaction();
      return { cart, reorderResults };
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      mongoSession.endSession();
    }
  }

  /**
   * Kitchen/Staff Status Updates with State Machine & Ownership
   */
  static async updateOrderStatus(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    nextStatus: OrderStatus,
    metadata: { reason?: string; delayMinutes?: number; estimatedMinutes?: number } = {}
  ) {
    const order = await this.getOrderAndVerifyOwnership(orderId, restaurantId);
    
    // Idempotency check + Transition validation
    this.validateTransition(order.status, nextStatus);
    if (order.status === nextStatus) return order;

    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      order.status = nextStatus;

      // Requirement #8: Inventory Hook
      if (nextStatus === OrderStatus.PREPARING) {
        await InventoryService.deductStock(order.items);
      }

      // Update timestamps and metadata
      switch (nextStatus) {
        case OrderStatus.CONFIRMED:
          order.acceptedAt = new Date();
          if (metadata.estimatedMinutes) {
            order.estimatedReadyTime = new Date(Date.now() + metadata.estimatedMinutes * 60000);
          }
          break;
        case OrderStatus.READY:
          order.readyAt = new Date();
          break;
        case OrderStatus.PICKED:
          order.pickedAt = new Date();
          break;
        case OrderStatus.SERVED:
          order.servedAt = new Date();
          break;
        case OrderStatus.COMPLETED:
          order.completedAt = new Date();
          break;
        case OrderStatus.CANCELLED:
          order.cancelledAt = new Date();
          break;
        case OrderStatus.DELAYED:
          order.delayReason = metadata.reason;
          if (metadata.delayMinutes) {
            const currentETR = order.estimatedReadyTime || new Date();
            order.estimatedReadyTime = new Date(currentETR.getTime() + metadata.delayMinutes * 60000);
          }
          break;
      }

      await order.save({ session: mongoSession });
      await mongoSession.commitTransaction();
      
      // Notify (Requirement #9: Real-time Integration)
      socketService.emitToSession(order.sessionId!.toString(), SocketEvent.ORDER_STATUS_UPDATED, order);
      socketService.emitToRestaurant(restaurantId.toString(), SocketEvent.ORDER_STATUS_UPDATED, order);

      return order;
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      mongoSession.endSession();
    }
  }

  static async getOrders(filter: object) {
    return OrderModel.find(filter).sort({ createdAt: -1 });
  }

  static async getOrderById(orderId: string | Types.ObjectId, restaurantId: string | Types.ObjectId) {
    return this.getOrderAndVerifyOwnership(orderId, restaurantId);
  }
}
