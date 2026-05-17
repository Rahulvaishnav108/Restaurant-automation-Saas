import mongoose from 'mongoose';
import { BillingModel } from './billing.model';
import { OrderModel } from '../orders/orders.model';
import { BillStatus, PaymentMethod } from './billing.schema';
import { OrderStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

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

    // Assume 5% service charge
    const serviceCharge = subtotal * 0.05;
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
    const activeOrders = await OrderModel.find({
      restaurantId,
      sessionId,
      status: { $in: [OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELAYED] }
    });

    if (activeOrders.length > 0) {
      throw new AppError('Cannot generate final bill while there are active orders. Please wait for all orders to be served.', 400, ErrorCode.INVALID_REQUEST);
    }

    const liveBill = await this.getLiveBill(restaurantId, sessionId);

    if (liveBill.orders.length === 0) {
      throw new AppError('No valid orders found for this session.', 400, ErrorCode.INVALID_REQUEST);
    }

    const orderIds = liveBill.orders.map(o => o._id as mongoose.Types.ObjectId);

    let bill = await BillingModel.findOne({ restaurantId, sessionId });

    if (bill) {
      if (bill.status === BillStatus.PAID) {
        throw new AppError('Bill is already paid.', 400, ErrorCode.INVALID_REQUEST);
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
    let bill = await BillingModel.findOne({ restaurantId, sessionId });
    if (!bill) {
      throw new AppError('Bill not found. Please request bill first.', 404, ErrorCode.NOT_FOUND);
    }

    if (bill.status === BillStatus.PAID) {
      throw new AppError('Cannot apply coupon to a paid bill.', 400, ErrorCode.INVALID_REQUEST);
    }

    if (couponCode !== 'DISCOUNT10') {
      throw new AppError('Invalid coupon code.', 400, ErrorCode.VALIDATION_ERROR);
    }

    const isAlreadyApplied = bill.appliedCoupons.some(c => c.code === couponCode);
    if (isAlreadyApplied) {
      throw new AppError('Coupon already applied.', 400, ErrorCode.VALIDATION_ERROR);
    }

    const discountAmount = bill.subtotal * 0.10;

    bill.appliedCoupons.push({
      couponId: new mongoose.Types.ObjectId(), // Mock ID for now
      code: couponCode,
      discountAmount
    });

    bill.discountAmount += discountAmount;
    bill.finalAmount = Math.max(0, bill.finalAmount - discountAmount);

    await bill.save();
    return bill;
  }

  static async removeCoupon(restaurantId: string, sessionId: string, couponCode: string) {
    let bill = await BillingModel.findOne({ restaurantId, sessionId });
    if (!bill) {
      throw new AppError('Bill not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (bill.status === BillStatus.PAID) {
      throw new AppError('Cannot modify a paid bill.', 400, ErrorCode.INVALID_REQUEST);
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
      throw new AppError('Bill not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (bill.status === BillStatus.PAID) {
      throw new AppError('Bill is already paid.', 400, ErrorCode.INVALID_REQUEST);
    }

    const intentId = `pi_mock_${Date.now()}`;
    
    bill.paymentId = intentId;
    bill.paymentMethod = paymentMethod;
    await bill.save();

    return {
      billId: bill._id,
      paymentIntentId: intentId,
      amount: bill.finalAmount,
      currency: 'INR'
    };
  }

  static async verifyPayment(restaurantId: string, sessionId: string, paymentId: string) {
    let bill = await BillingModel.findOne({ restaurantId, sessionId });
    if (!bill) {
      throw new AppError('Bill not found.', 404, ErrorCode.NOT_FOUND);
    }

    if (bill.paymentId !== paymentId) {
      throw new AppError('Invalid payment ID.', 400, ErrorCode.VALIDATION_ERROR);
    }

    bill.status = BillStatus.PAID;
    bill.paidAt = new Date();
    await bill.save();

    return bill;
  }

  static async getPaymentStatus(restaurantId: string, sessionId: string, paymentId: string) {
    const bill = await BillingModel.findOne({ restaurantId, sessionId, paymentId });
    if (!bill) {
      throw new AppError('Bill/Payment not found.', 404, ErrorCode.NOT_FOUND);
    }

    return {
      status: bill.status,
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
