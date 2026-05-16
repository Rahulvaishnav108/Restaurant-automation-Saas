import { Types } from 'mongoose';
import { OrderModel } from './orders.model';
import { Cart } from '../cart/cart.model';
import { PlaceOrderInput, OrderStatus, PaymentStatus } from './orders.schema';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

export class OrdersService {
  static async placeOrder(
    restaurantId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
    tableId: string | Types.ObjectId,
    customerName: string | undefined,
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

  // --- Kitchen Order APIs ---

  static async getKitchenOrders(restaurantId: string | Types.ObjectId) {
    return OrderModel.find({
      restaurantId,
      status: {
        $in: [
          OrderStatus.PENDING,
          OrderStatus.ACCEPTED,
          OrderStatus.PREPARING,
          OrderStatus.READY,
        ],
      },
    }).sort({ createdAt: 1 });
  }

  static async getKitchenOrderDetails(restaurantId: string | Types.ObjectId, orderId: string | Types.ObjectId) {
    const order = await OrderModel.findOne({ _id: orderId, restaurantId }).populate('items.menuItemId');
    if (!order) {
      throw new AppError('Order not found', 404, ErrorCode.NOT_FOUND);
    }
    return order;
  }

  static async acceptOrder(restaurantId: string | Types.ObjectId, orderId: string | Types.ObjectId, estimatedTime?: number) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError('Only pending orders can be accepted', 400, ErrorCode.VALIDATION_ERROR);
    }

    order.status = OrderStatus.ACCEPTED;
    order.acceptedAt = new Date();
    if (estimatedTime) {
      order.estimatedPreparationTime = estimatedTime;
    }

    await order.save();
    return order;
  }

  static async startCooking(restaurantId: string | Types.ObjectId, orderId: string | Types.ObjectId) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    if (order.status !== OrderStatus.ACCEPTED && order.status !== OrderStatus.PENDING) {
      throw new AppError('Order cannot be prepared from current status', 400, ErrorCode.VALIDATION_ERROR);
    }

    order.status = OrderStatus.PREPARING;
    await order.save();
    return order;
  }

  static async markReady(restaurantId: string | Types.ObjectId, orderId: string | Types.ObjectId) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    if (order.status !== OrderStatus.PREPARING) {
      throw new AppError('Only preparing orders can be marked ready', 400, ErrorCode.VALIDATION_ERROR);
    }

    order.status = OrderStatus.READY;
    order.readyAt = new Date();
    await order.save();
    return order;
  }

  static async rejectOrder(restaurantId: string | Types.ObjectId, orderId: string | Types.ObjectId, reason: string) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError('Only pending orders can be rejected', 400, ErrorCode.VALIDATION_ERROR);
    }

    order.status = OrderStatus.REJECTED;
    order.cancelledAt = new Date();
    order.rejectionReason = reason;
    await order.save();
    return order;
  }

  static async delayOrder(restaurantId: string | Types.ObjectId, orderId: string | Types.ObjectId, delayMinutes: number) {
    const order = await this.getKitchenOrderDetails(restaurantId, orderId);

    const activeStatuses = [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PREPARING];
    if (!activeStatuses.includes(order.status as OrderStatus)) {
      throw new AppError('Cannot delay order in current status', 400, ErrorCode.VALIDATION_ERROR);
    }

    if (order.estimatedPreparationTime) {
      order.estimatedPreparationTime += delayMinutes;
    } else {
      order.estimatedPreparationTime = delayMinutes;
    }

    await order.save();
    return order;
  }
}
