import mongoose from 'mongoose';
import { BillingModel } from './billing.model';
import { OrderModel } from '../orders/orders.model';
import { BillStatus, PaymentMethod, PaymentStatus } from './billing.schema';
import { OrderStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { endSession } from '../tableSessions/tableSessions.service';
import { InventoryService } from '../inventory/inventory.service';
import { OfferModel } from '../offers/offers.model';
import { RestaurantModel } from '../restaurants/restaurants.model';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../../constants/roles';
import { NotificationCategory, NotificationPriority } from '../notifications/notifications.schema';

export class BillingService {
  /**
   * Generates a live bill based on current orders for a session.
   */
  static async getLiveBill(restaurantId: string, sessionId: string) {
    const orders = await OrderModel.find({
      restaurantId,
      sessionId,
      status: { $ne: OrderStatus.CANCELLED }
    });

    if (!orders || orders.length === 0) {
      return {
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        serviceCharge: 0,
        finalAmount: 0,
        orders: []
      };
    }

    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    orders.forEach(order => {
      subtotal += order.totalAmount;
      taxAmount += order.taxAmount;
      discountAmount += order.discountAmount;
    });

    // Fetch service charge configuration dynamically from restaurant settings
    const restaurant = await RestaurantModel.findById(restaurantId);
    const serviceChargeEnabled = restaurant?.settings?.serviceChargeEnabled ?? true;
    const serviceCharge = serviceChargeEnabled ? subtotal * 0.05 : 0;
    const finalAmount = subtotal + taxAmount + serviceCharge - discountAmount;

    return {
      subtotal,
      taxAmount,
      serviceCharge,
      discountAmount,
      finalAmount,
      orders
    };
  }

  /**
   * Requests the final bill. Creates or updates the Bill document.
   */
  static async requestFinalBill(restaurantId: string, sessionId: string) {
    // Transition all active/served orders to BILLED
    const activeOrders = await OrderModel.find({
      restaurantId,
      sessionId,
      status: { $in: [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.DELAYED,
        OrderStatus.READY,
        OrderStatus.PICKED,
        OrderStatus.SERVED
      ] }
    });

    for (const order of activeOrders) {
      order.status = OrderStatus.BILLED;
      await order.save();
    }

    const liveBill = await this.getLiveBill(restaurantId, sessionId);

    if (liveBill.orders.length === 0) {
      throw new AppError('No valid orders found for this session.', 400, ErrorCode.INVALID_REQUEST);
    }

    const orderIds = liveBill.orders.map(o => o._id as mongoose.Types.ObjectId);

    let bill = await BillingModel.findOne({ restaurantId, sessionId });

    if (bill) {
      if (bill.status === BillStatus.PAID || bill.status === BillStatus.PENDING_PAYMENT) {
        throw new AppError('Bill is already finalized or paid.', 400, ErrorCode.INVALID_REQUEST);
      }
      
      bill.subtotal = liveBill.subtotal;
      bill.taxAmount = liveBill.taxAmount;
      bill.serviceCharge = liveBill.serviceCharge;
      
      const couponDiscount = bill.appliedCoupons.reduce((sum, c) => sum + c.discountAmount, 0);
      bill.discountAmount = liveBill.discountAmount + couponDiscount;
      bill.finalAmount = bill.subtotal + bill.taxAmount + bill.serviceCharge - bill.discountAmount;
      
      bill.orderIds = orderIds;
      bill.status = BillStatus.GENERATED;
      bill.requestedAt = new Date();
      await bill.save();
    } else {
      bill = await BillingModel.create({
        restaurantId,
        sessionId,
        orderIds,
        subtotal: liveBill.subtotal,
        taxAmount: liveBill.taxAmount,
        serviceCharge: liveBill.serviceCharge,
        discountAmount: liveBill.discountAmount,
        finalAmount: liveBill.finalAmount,
        status: BillStatus.GENERATED,
        requestedAt: new Date(),
      });
    }

    return bill;
  }

  static async applyCoupon(restaurantId: string, sessionId: string, couponCode: string) {
    const bill = await BillingModel.findOne({ restaurantId, sessionId });
    if (!bill) {
      throw new AppError('Bill not found. Please request bill first.', 404, ErrorCode.NOT_FOUND);
    }

    if (bill.status === BillStatus.PAID || bill.status === BillStatus.PENDING_PAYMENT) {
      throw new AppError('Cannot apply coupon to a finalized or paid bill.', 400, ErrorCode.INVALID_REQUEST);
    }

    const offer = await OfferModel.findOne({
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      code: couponCode.toUpperCase(),
      active: true
    });
    if (!offer) {
      throw new AppError('Invalid coupon code.', 400, ErrorCode.VALIDATION_ERROR);
    }

    const isAlreadyApplied = bill.appliedCoupons.some(c => c.code === couponCode.toUpperCase());
    if (isAlreadyApplied) {
      throw new AppError('Coupon already applied.', 400, ErrorCode.VALIDATION_ERROR);
    }

    const discountAmount = bill.subtotal * (offer.discountPercent / 100);

    bill.appliedCoupons.push({
      couponId: offer._id as mongoose.Types.ObjectId,
      code: offer.code,
      discountAmount
    });

    bill.discountAmount += discountAmount;
    bill.finalAmount = Math.max(0, bill.finalAmount - discountAmount);

    await bill.save();
    return bill;
  }

  static async removeCoupon(restaurantId: string, sessionId: string, couponCode: string) {
    const bill = await BillingModel.findOne({ restaurantId, sessionId });
    if (!bill) {
      throw new AppError('Bill not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (bill.status === BillStatus.PAID || bill.status === BillStatus.PENDING_PAYMENT) {
      throw new AppError('Cannot modify a finalized or paid bill.', 400, ErrorCode.INVALID_REQUEST);
    }

    const couponIndex = bill.appliedCoupons.findIndex(c => c.code === couponCode);
    if (couponIndex === -1) {
      throw new AppError('Coupon not found on this bill.', 404, ErrorCode.NOT_FOUND);
    }

    const discountAmount = bill.appliedCoupons[couponIndex].discountAmount;
    bill.appliedCoupons.splice(couponIndex, 1);

    bill.discountAmount = Math.max(0, bill.discountAmount - discountAmount);
    bill.finalAmount += discountAmount;

    await bill.save();
    return bill;
  }

  static async createPayment(restaurantId: string, sessionId: string, paymentMethod: PaymentMethod) {
    let bill = await BillingModel.findOne({ restaurantId, sessionId });
    if (!bill) {
      bill = await this.requestFinalBill(restaurantId, sessionId);
    }

    if (bill.status === BillStatus.PAID) {
      throw new AppError('Bill is already paid.', 400, ErrorCode.INVALID_REQUEST);
    }

    const intentId = `pay_mock_${restaurantId}_${Date.now()}`;
    
    bill.paymentId = intentId;
    bill.paymentMethod = paymentMethod;
    bill.status = BillStatus.PENDING_PAYMENT;
    bill.paymentStatus = PaymentStatus.PENDING;
    await bill.save();

    return {
      billId: bill._id,
      paymentIntentId: intentId,
      amount: bill.finalAmount,
      currency: 'INR',
      payment: {
        id: intentId,
        _id: intentId,
        amount: bill.finalAmount,
        method: paymentMethod,
        status: PaymentStatus.PENDING
      }
    };
  }

  static async verifyPayment(restaurantId: string, sessionId: string, paymentId: string, simulateStatus?: PaymentStatus) {
    const bill = await BillingModel.findOne({ restaurantId, sessionId });
    if (!bill) {
      throw new AppError('Bill not found.', 404, ErrorCode.NOT_FOUND);
    }

    // Idempotency check
    if (bill.paymentId === paymentId && bill.status === BillStatus.PAID && bill.paymentStatus === PaymentStatus.PAID) {
      return bill; // Already processed
    }

    if (bill.paymentId !== paymentId) {
      throw new AppError('Invalid payment ID.', 400, ErrorCode.VALIDATION_ERROR);
    }

    // Mock failure behavior
    if (simulateStatus === PaymentStatus.FAILED || paymentId.includes('fail')) {
      bill.paymentStatus = PaymentStatus.FAILED;
      bill.status = BillStatus.FAILED;
      await bill.save();
      throw new AppError('Payment processing failed.', 400, ErrorCode.PAYMENT_FAILED);
    }

    // Mock expired behavior
    if (simulateStatus === PaymentStatus.EXPIRED) {
      bill.paymentStatus = PaymentStatus.EXPIRED;
      bill.status = BillStatus.DRAFT; // Revert to a pre-payment state
      await bill.save();
      throw new AppError('Payment session expired.', 400, ErrorCode.PAYMENT_FAILED);
    }

    // Mock pending behavior (doing nothing and waiting)
    if (simulateStatus === PaymentStatus.PENDING) {
      return bill;
    }

    bill.status = BillStatus.PAID;
    bill.paymentStatus = PaymentStatus.PAID;
    bill.paidAt = new Date();
    await bill.save();

    // Transition all BILLED orders to PAID
    const billedOrders = await OrderModel.find({
      restaurantId,
      sessionId,
      status: OrderStatus.BILLED
    });

    for (const order of billedOrders) {
      order.status = OrderStatus.PAID;
      order.paymentStatus = 'PAID' as any;
      await order.save();
    }

    // Trigger persistent notification targeting CUSTOMER
    try {
      await NotificationsService.createNotification({
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        tableSessionId: new mongoose.Types.ObjectId(sessionId),
        recipientRole: UserRole.CUSTOMER,
        title: 'Payment Successful',
        message: `Your payment of INR ${bill.finalAmount} was verified successfully.`,
        type: 'PAYMENT_SUCCESS',
        category: NotificationCategory.SYSTEM,
        priority: NotificationPriority.HIGH,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    } catch (notifError) {
      console.error('Failed to trigger payment success notification:', notifError);
    }

    // Trigger stock deduction hook
    try {
      const orders = await OrderModel.find({
        restaurantId,
        sessionId,
        status: { $ne: OrderStatus.CANCELLED }
      });
      const orderItems = orders.flatMap(order => order.items);
      if (orderItems.length > 0) {
        await InventoryService.deductStock(orderItems);
      }
    } catch (inventoryError) {
      console.error(`Failed to deduct inventory for session ${sessionId}:`, inventoryError);
    }

    // End session automatically upon successful payment is disabled to allow subsequent session-linked operations (e.g. feedback, loyalty, reorders) in the PRD lifecycle.
    /*
    try {
      await endSession(sessionId, 'Bill paid successfully');
    } catch (error) {
      console.error(`Failed to close session ${sessionId} after payment:`, error);
    }
    */

    return bill;
  }

  static async getPaymentStatus(restaurantId: string, sessionId: string, paymentId: string) {
    const bill = await BillingModel.findOne({ restaurantId, sessionId, paymentId });
    if (!bill) {
      throw new AppError('Bill/Payment not found.', 404, ErrorCode.NOT_FOUND);
    }

    return {
      status: bill.status,
      paymentStatus: bill.paymentStatus,
      paidAt: bill.paidAt,
      paymentMethod: bill.paymentMethod
    };
  }

  static async getRevenueReport(restaurantId: string) {
    const result = await BillingModel.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: BillStatus.PAID } },
      { $group: { _id: null, totalRevenue: { $sum: "$finalAmount" } } }
    ]);
    return result[0] || { totalRevenue: 0 };
  }

  static async getTaxReport(restaurantId: string) {
    const result = await BillingModel.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: BillStatus.PAID } },
      { $group: { _id: null, totalTax: { $sum: "$taxAmount" } } }
    ]);
    return result[0] || { totalTax: 0 };
  }

  static async getOrderBillingReport(restaurantId: string) {
    const result = await BillingModel.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    return result;
  }

  static async getDiscountReport(restaurantId: string) {
    const result = await BillingModel.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: BillStatus.PAID } },
      { $group: { _id: null, totalDiscount: { $sum: "$discountAmount" } } }
    ]);
    return result[0] || { totalDiscount: 0 };
  }

  static async getPaymentReport(restaurantId: string) {
    const result = await BillingModel.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: BillStatus.PAID } },
      { $group: { _id: "$paymentMethod", count: { $sum: 1 }, totalAmount: { $sum: "$finalAmount" } } }
    ]);
    return result;
  }
}
