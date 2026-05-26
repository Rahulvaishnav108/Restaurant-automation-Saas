import { Types } from 'mongoose';
import { OrderModel } from './orders.model';
import { Cart } from '../cart/cart.model';
import { PlaceOrderInput, OrderStatus, PaymentStatus } from './orders.schema';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { Priority } from '../../constants/statuses';
import { TableModel } from '../tables/tables.model';
import mongoose from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../../constants/roles';
import { NotificationCategory, NotificationPriority } from '../notifications/notifications.schema';

const ORDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED, OrderStatus.REJECTED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY],
  [OrderStatus.READY]: [OrderStatus.SERVED],
  [OrderStatus.SERVED]: [OrderStatus.BILLED],
  [OrderStatus.BILLED]: [OrderStatus.PAID],
  [OrderStatus.PAID]: [OrderStatus.COMPLETED],
};

function ensureOrderTransition(currentStatus: OrderStatus, nextStatus: OrderStatus, message: string): void {
  const allowed = ORDER_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new AppError(message, 400, ErrorCode.ORDER_NOT_MODIFIABLE);
  }
}

function toNullableObjectId(value?: string | Types.ObjectId | null): Types.ObjectId | null {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? new mongoose.Types.ObjectId(value) : value;
}

export class OrdersService {
  static async placeOrder(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    tableId: string | Types.ObjectId,
    _customerName: string | undefined,
    data: PlaceOrderInput
  ) {
    // 1. Fetch Cart
    const cart = await Cart.findOne({ restaurantId, sessionId }).populate('items.menuItem');

    if (!cart) {
      throw new AppError('Cart not found', 404, ErrorCode.NOT_FOUND);
    }

    if (!cart.items || cart.items.length === 0) {
      throw new AppError('Cannot place order with an empty cart', 400, ErrorCode.VALIDATION_ERROR);
    }

    // 2. Map CartItems to OrderItems
    const orderItems = cart.items.map((item: any) => {
      if (!item.menuItem) {
        throw new AppError('Invalid menu item in cart', 400, ErrorCode.VALIDATION_ERROR);
      }
      return {
        menuItemId: item.menuItem._id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.unitPrice,
        totalPrice: item.subtotal,
        notes: item.notes || '',
      };
    });

    // 3. Generate Order Number
    // A simple order number: e.g., ORD-12345678 (could be improved)
    const timestamp = Date.now().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${randomChars}`;

    // 4. Create Order
    const order = await OrderModel.create({
      restaurantId,
      tableId,
      sessionId,
      // If customer is registered, we could map customerId here.
      // But currently session tracks customerName and mobile. The schema has customerId which is User ref.
      orderNumber,
      items: orderItems,
      totalAmount: cart.subtotal,
      taxAmount: cart.tax,
      discountAmount: cart.discount,
      finalAmount: cart.grandTotal,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      priority: Priority.NORMAL,
      specialInstructions: data.specialInstructions || '',
    });

    // 5. Clear Cart
    cart.items = [] as any;
    cart.subtotal = 0;
    cart.tax = 0;
    cart.discount = 0;
    cart.grandTotal = 0;
    await cart.save();

    return order;
  }

  static async getCustomerOrders(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    options: { status?: string; page?: number; limit?: number } = {},
  ) {
    const page = Number(options.page ?? 1);
    const limit = Number(options.limit ?? 10);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { restaurantId, sessionId };
    if (options.status) {
      query.status = options.status;
    }

    const [orders, total] = await Promise.all([
      OrderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments(query),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  static async getCustomerOrderById(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
  ) {
    const order = await OrderModel.findOne({ _id: orderId, restaurantId, sessionId });
    if (!order) {
      throw new AppError('Order not found', 404, ErrorCode.NOT_FOUND);
    }

    return order;
  }

  static async reorder(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    tableId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
  ) {
    const original = await this.getCustomerOrderById(restaurantId, sessionId, orderId);

    if (original.status === OrderStatus.CANCELLED || original.status === OrderStatus.REJECTED) {
      throw new AppError('Cancelled or rejected orders cannot be reordered', 400, ErrorCode.ORDER_NOT_MODIFIABLE);
    }

    const timestamp = Date.now().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${randomChars}`;

    return OrderModel.create({
      restaurantId,
      tableId,
      sessionId,
      orderNumber,
      items: original.items,
      totalAmount: original.totalAmount,
      taxAmount: original.taxAmount,
      discountAmount: original.discountAmount,
      finalAmount: original.finalAmount,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      priority: original.priority ?? Priority.NORMAL,
      specialInstructions: original.specialInstructions,
    });
  }

  static async cancelOrder(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
  ) {
    const order = await this.getCustomerOrderById(restaurantId, sessionId, orderId);

    ensureOrderTransition(order.status as OrderStatus, OrderStatus.CANCELLED, 'Order cannot be cancelled in its current state');

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    await order.save();

    return order;
  }

  // --- Kitchen Order APIs ---

  static async getKitchenOrders(
    restaurantId: string | Types.ObjectId,
    options: {
      status?: string;
      priority?: string;
      table?: string;
      batch?: boolean;
    } = {}
  ) {
    const query: Record<string, unknown> = {
      restaurantId,
      status: options.status
        ? options.status
        : {
            $in: [
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
              OrderStatus.PREPARING,
              OrderStatus.READY,
            ],
          },
    };

    if (options.priority) {
      query.priority = options.priority;
    }

    if (options.batch) {
      query.batchId = { $ne: null };
    }

    if (options.table) {
      if (Types.ObjectId.isValid(options.table)) {
        query.tableId = new Types.ObjectId(options.table);
      } else {
        const tableIds = await TableModel.find({
          restaurantId,
          tableNumber: options.table,
        }).distinct('_id');
        query.tableId = tableIds.length > 0 ? { $in: tableIds } : null;
      }
    }

    return OrderModel.find(query).sort({ createdAt: 1 });
  }

  static async getKitchenOrderDetails(restaurantId: string | Types.ObjectId, orderId: string | Types.ObjectId) {
    const order = await OrderModel.findOne({ _id: orderId, restaurantId }).populate('items.menuItemId');
    if (!order) {
      throw new AppError('Order not found', 404, ErrorCode.NOT_FOUND);
    }
    return order;
  }

  static async acceptOrder(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    estimatedTime?: number,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    ensureOrderTransition(order.status as OrderStatus, OrderStatus.CONFIRMED, 'Only pending orders can be accepted');

    order.status = OrderStatus.CONFIRMED;
    order.acceptedAt = new Date();
    order.kitchenStaffId = toNullableObjectId(actorId);
    if (estimatedTime) {
      order.estimatedPreparationTime = estimatedTime;
    }

    await order.save();

    // Trigger persistent notification targeting CUSTOMER
    await NotificationsService.createNotification({
      restaurantId: order.restaurantId,
      tableSessionId: order.sessionId,
      recipientRole: UserRole.CUSTOMER,
      title: 'Order Confirmed',
      message: `Your order ${order.orderNumber} has been confirmed.`,
      type: 'ORDER_CONFIRMED',
      category: NotificationCategory.SYSTEM,
      priority: NotificationPriority.NORMAL,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return order;
  }

  static async startCooking(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    ensureOrderTransition(order.status as OrderStatus, OrderStatus.PREPARING, 'Order cannot be prepared from current status');

    order.status = OrderStatus.PREPARING;
    order.preparingStartedAt = new Date();
    order.kitchenStaffId = toNullableObjectId(actorId);
    await order.save();
    return order;
  }

  static async markReady(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    ensureOrderTransition(order.status as OrderStatus, OrderStatus.READY, 'Only preparing orders can be marked ready');

    order.status = OrderStatus.READY;
    order.readyAt = new Date();
    order.kitchenStaffId = toNullableObjectId(actorId);
    await order.save();

    // Trigger persistent notification targeting SERVICE_STAFF
    await NotificationsService.createNotification({
      restaurantId: order.restaurantId,
      tableSessionId: order.sessionId,
      recipientRole: UserRole.SERVICE_STAFF,
      title: 'Order Ready for Pickup',
      message: `Order ${order.orderNumber} is ready to be served.`,
      type: 'ORDER_READY',
      category: NotificationCategory.STAFF,
      priority: NotificationPriority.HIGH,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return order;
  }

  static async rejectOrder(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    reason: string,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    ensureOrderTransition(order.status as OrderStatus, OrderStatus.REJECTED, 'Only pending orders can be rejected');

    order.status = OrderStatus.REJECTED;
    order.cancelledAt = new Date();
    order.rejectedAt = new Date();
    order.kitchenStaffId = toNullableObjectId(actorId);
    order.rejectionReason = reason;
    await order.save();
    return order;
  }

  static async delayOrder(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    delayMinutes: number,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    // No status transition change; must be in CONFIRMED or PREPARING status to be delayed.
    if (order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.PREPARING) {
      throw new AppError('Cannot delay order in current status', 400, ErrorCode.ORDER_NOT_MODIFIABLE);
    }

    if (order.estimatedPreparationTime) {
      order.estimatedPreparationTime += delayMinutes;
    } else {
      order.estimatedPreparationTime = delayMinutes;
    }
    order.delayedAt = new Date();
    order.kitchenStaffId = toNullableObjectId(actorId);

    await order.save();
    return order;
  }

  static async getReadyOrders(restaurantId: string | Types.ObjectId) {
    return OrderModel.find({ restaurantId, status: OrderStatus.READY }).sort({ updatedAt: 1 });
  }

  static async pickFood(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    // Keep order status as READY, do not transition to obsolete PICKED status
    if (order.status !== OrderStatus.READY) {
      throw new AppError('Only ready orders can be picked', 400, ErrorCode.ORDER_NOT_MODIFIABLE);
    }

    order.pickedAt = new Date();
    order.serviceStaffId = toNullableObjectId(actorId);
    await order.save();
    return order;
  }

  static async markServed(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    // Only ready orders can transition to served (since PICKED is retired as a status)
    ensureOrderTransition(order.status as OrderStatus, OrderStatus.SERVED, 'Only ready orders can be served');

    order.status = OrderStatus.SERVED;
    order.servedAt = new Date();
    order.serviceStaffId = toNullableObjectId(actorId);
    await order.save();
    return order;
  }

  static async markCompleted(
    restaurantId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    actorId?: string | Types.ObjectId | null,
  ) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    ensureOrderTransition(order.status as OrderStatus, OrderStatus.COMPLETED, 'Only paid orders can be completed');

    order.status = OrderStatus.COMPLETED;
    order.completedAt = new Date();
    order.serviceStaffId = toNullableObjectId(actorId);
    await order.save();
    return order;
  }
}
