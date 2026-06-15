import mongoose from 'mongoose';
import { ErrorCode } from '../../constants/errors';
import { PaymentStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { BillingModel } from '../billing/billing.model';
import {
  PaymentMethod,
  PaymentStatus as BillingPaymentStatus,
} from '../billing/billing.schema';
import { BillingService } from '../billing/billing.service';
import { PaymentModel } from './payments.model';
import type { ListPaymentsQuery, VerifyPaymentInput } from './payments.schema';

function toObjectId(value: string): mongoose.Types.ObjectId {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError('Invalid id', 400, ErrorCode.INVALID_REQUEST);
  }

  return new mongoose.Types.ObjectId(value);
}

function mapVerificationStatus(status?: VerifyPaymentInput['simulateStatus']): BillingPaymentStatus | undefined {
  if (!status) {
    return undefined;
  }

  if (status === 'COMPLETED' || status === 'PAID') {
    return undefined;
  }

  return status as BillingPaymentStatus;
}

function buildPaymentFilter(restaurantId: string, query: ListPaymentsQuery) {
  const filter: Record<string, unknown> = {
    restaurantId: toObjectId(restaurantId),
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.method) {
    filter.method = query.method;
  }

  if (query.sessionId) {
    filter.sessionId = toObjectId(query.sessionId);
  }

  if (query.orderId) {
    filter.orderId = toObjectId(query.orderId);
  }

  if (query.from || query.to) {
    filter.createdAt = {
      ...(query.from && { $gte: query.from }),
      ...(query.to && { $lte: query.to }),
    };
  }

  return filter;
}

export class PaymentsService {
  static async createCustomerPayment(restaurantId: string, sessionId: string, method: PaymentMethod) {
    const result = await BillingService.createPayment(restaurantId, sessionId, method);

    const payment = await PaymentModel.findOneAndUpdate(
      {
        restaurantId: toObjectId(restaurantId),
        sessionId: toObjectId(sessionId),
        status: PaymentStatus.PENDING,
      },
      {
        provider: 'mock',
        providerPaymentId: result.paymentIntentId,
        currency: result.currency,
        metadata: {
          billId: result.billId,
          source: 'customer_payment_create',
        },
      },
      { new: true, sort: { createdAt: -1 } },
    ).lean();

    return {
      ...result,
      payment,
    };
  }

  static async verifyCustomerPayment(
    restaurantId: string,
    sessionId: string,
    paymentId: string,
    simulateStatus?: VerifyPaymentInput['simulateStatus'],
  ) {
    const bill = await BillingService.verifyPayment(
      restaurantId,
      sessionId,
      paymentId,
      mapVerificationStatus(simulateStatus),
    );

    const payment = await PaymentModel.findOne({
      restaurantId: toObjectId(restaurantId),
      sessionId: toObjectId(sessionId),
      $or: [{ providerPaymentId: paymentId }, { _id: mongoose.Types.ObjectId.isValid(paymentId) ? toObjectId(paymentId) : null }],
    }).lean();

    return {
      bill,
      payment,
    };
  }

  static async getCustomerPaymentStatus(restaurantId: string, sessionId: string, paymentId: string) {
    const payment = await PaymentModel.findOne({
      restaurantId: toObjectId(restaurantId),
      sessionId: toObjectId(sessionId),
      $or: [{ providerPaymentId: paymentId }, { _id: mongoose.Types.ObjectId.isValid(paymentId) ? toObjectId(paymentId) : null }],
    }).lean();

    if (payment) {
      return {
        paymentId: payment.providerPaymentId ?? payment._id,
        status: payment.status,
        method: payment.method,
        amount: payment.amount,
        currency: payment.currency,
        verifiedAt: payment.verifiedAt,
        failureReason: payment.failureReason,
      };
    }

    const bill = await BillingModel.findOne({
      restaurantId: toObjectId(restaurantId),
      sessionId: toObjectId(sessionId),
      paymentId,
    }).lean();

    if (!bill) {
      throw new AppError('Payment not found', 404, ErrorCode.NOT_FOUND);
    }

    return {
      paymentId,
      status: bill.paymentStatus ?? BillingPaymentStatus.PENDING,
      method: bill.paymentMethod,
      amount: bill.finalAmount,
      currency: 'INR',
      paidAt: bill.paidAt,
    };
  }

  static async listCustomerPayments(restaurantId: string, sessionId: string) {
    const payments = await PaymentModel.find({
      restaurantId: toObjectId(restaurantId),
      sessionId: toObjectId(sessionId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      payments,
      meta: {
        count: payments.length,
      },
    };
  }

  static async listRestaurantPayments(restaurantId: string, query: ListPaymentsQuery) {
    const filter = buildPaymentFilter(restaurantId, query);
    const skip = (query.page - 1) * query.limit;

    const [payments, total] = await Promise.all([
      PaymentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(),
      PaymentModel.countDocuments(filter),
    ]);

    return {
      payments,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    };
  }

  static async getRestaurantPaymentSummary(restaurantId: string, query: ListPaymentsQuery) {
    const filter = buildPaymentFilter(restaurantId, query);
    const [summary] = await PaymentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', PaymentStatus.COMPLETED] }, '$amount', 0],
            },
          },
          totalPayments: { $sum: 1 },
          completedPayments: {
            $sum: {
              $cond: [{ $eq: ['$status', PaymentStatus.COMPLETED] }, 1, 0],
            },
          },
          failedPayments: {
            $sum: {
              $cond: [{ $eq: ['$status', PaymentStatus.FAILED] }, 1, 0],
            },
          },
          refundedPayments: {
            $sum: {
              $cond: [{ $eq: ['$status', PaymentStatus.REFUNDED] }, 1, 0],
            },
          },
        },
      },
    ]);

    const byMethod = await PaymentModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$method',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    return {
      summary: summary ?? {
        totalAmount: 0,
        completedAmount: 0,
        totalPayments: 0,
        completedPayments: 0,
        failedPayments: 0,
        refundedPayments: 0,
      },
      byMethod,
      filters: {
        status: query.status ?? null,
        method: query.method ?? null,
        from: query.from ?? null,
        to: query.to ?? null,
      },
    };
  }

  static async markCashPaymentCollected(restaurantId: string, paymentId: string) {
    const payment = await PaymentModel.findOne({
      restaurantId: toObjectId(restaurantId),
      $or: [{ providerPaymentId: paymentId }, { _id: mongoose.Types.ObjectId.isValid(paymentId) ? toObjectId(paymentId) : null }],
      method: PaymentMethod.CASH,
    });

    if (!payment) {
      throw new AppError('Cash payment not found', 404, ErrorCode.NOT_FOUND);
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      return payment;
    }

    if (!payment.sessionId || !payment.providerPaymentId) {
      throw new AppError('Payment cannot be verified automatically', 400, ErrorCode.INVALID_REQUEST);
    }

    await BillingService.verifyPayment(
      restaurantId,
      payment.sessionId.toString(),
      payment.providerPaymentId,
    );

    return PaymentModel.findById(payment._id);
  }
}
