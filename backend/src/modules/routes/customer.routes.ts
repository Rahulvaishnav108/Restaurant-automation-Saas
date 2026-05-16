import { Router } from 'express';
import { requireSession } from '../../middleware/requireSession';
import { ok } from '../../utils/responses';
import { endSession } from '../tableSessions/tableSessions.service';
import { TableSessionModel } from '../tableSessions/tableSessions.model';
import { OrderModel } from '../orders/orders.model';
import { PaymentModel } from '../payments/payments.model';
import { FeedbackModel } from '../feedback/feedback.model';
import { OfferModel } from '../offers/offers.model';
import { StaffRequestModel } from '../staff/staffRequest.model';
import { Priority, RequestStatus, RequestType } from '../../constants/statuses';
import { OrderStatus as OrderPaymentStatus } from '../orders/orders.schema';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

export const customerRouter = Router();

customerRouter.use(requireSession);

customerRouter.get('/session', async (req, res, next) => {
  try {
    const session = await TableSessionModel.findById(req.tableSession!._id);
    ok(res, { session });
  } catch (error) {
    next(error);
  }
});

customerRouter.patch('/session/extend', async (req, res, next) => {
  try {
    const session = await TableSessionModel.findByIdAndUpdate(
      req.tableSession!._id,
      {
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        lastActivityAt: new Date(),
      },
      { new: true },
    );

    ok(res, { session });
  } catch (error) {
    next(error);
  }
});

customerRouter.post('/session/end', async (req, res, next) => {
  try {
    const session = await endSession(req.tableSession!._id, 'customer_closed');
    ok(res, { ended: true, sessionId: session._id.toString(), session });
  } catch (error) {
    next(error);
  }
});

const requestTypeMap: Record<string, RequestType> = {
  waiter: RequestType.WAITER,
  water: RequestType.WATER,
  cutlery: RequestType.CUTLERY,
  cleaning: RequestType.CLEANING,
  help: RequestType.HELP,
};

for (const [path, type] of Object.entries(requestTypeMap)) {
  customerRouter.post(`/requests/${path}`, async (req, res, next) => {
    try {
      const request = await StaffRequestModel.create({
        restaurantId: req.tableSession!.restaurantId,
        sessionId: req.tableSession!._id,
        tableId: req.tableSession!.tableId,
        type,
        status: RequestStatus.PENDING,
        priority: type === RequestType.WAITER || type === RequestType.HELP ? Priority.HIGH : Priority.NORMAL,
      });

      ok(res, { request }, 201);
    } catch (error) {
      next(error);
    }
  });
}

customerRouter.get('/bill', async (req, res, next) => {
  try {
    const orders = await OrderModel.find({
      restaurantId: req.tableSession!.restaurantId,
      sessionId: req.tableSession!._id,
      status: { $ne: OrderPaymentStatus.CANCELLED },
    });

    const subtotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const tax = orders.reduce((sum, order) => sum + order.taxAmount, 0);
    const discount = orders.reduce((sum, order) => sum + order.discountAmount, 0);

    ok(res, {
      bill: {
        subtotal,
        discount,
        tax,
        total: subtotal - discount + tax,
      },
    });
  } catch (error) {
    next(error);
  }
});

customerRouter.post('/bill/request', async (_req, res) => {
  ok(res, { requested: true, etaMinutes: 4 });
});

customerRouter.post('/bill/coupon', async (req, res, next) => {
  try {
    const offer = await OfferModel.findOne({
      restaurantId: req.tableSession!.restaurantId,
      code: String(req.body?.code ?? '').toUpperCase(),
      active: true,
    });

    const orders = await OrderModel.find({
      restaurantId: req.tableSession!.restaurantId,
      sessionId: req.tableSession!._id,
      status: { $ne: OrderPaymentStatus.CANCELLED },
    });
    const subtotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const savings = offer ? Math.round((subtotal * offer.discountPercent) / 100) : 0;

    ok(res, { appliedCoupon: offer?.code ?? req.body?.code ?? null, savings });
  } catch (error) {
    next(error);
  }
});

customerRouter.delete('/bill/coupon/:couponId', (req, res) => {
  ok(res, { removedCouponId: req.params.couponId });
});

customerRouter.post('/payments/create', async (req, res, next) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.body?.orderId,
      restaurantId: req.tableSession!.restaurantId,
      sessionId: req.tableSession!._id,
    });

    if (!order) {
      throw new AppError('Order not found', 404, ErrorCode.NOT_FOUND);
    }

    const payment = await PaymentModel.create({
      restaurantId: req.tableSession!.restaurantId,
      sessionId: req.tableSession!._id,
      orderId: order._id,
      amount: Number(req.body?.amount ?? order.finalAmount),
      method: req.body?.method ?? 'UPI',
    });

    ok(res, { payment }, 201);
  } catch (error) {
    next(error);
  }
});

customerRouter.post('/payments/verify', async (req, res, next) => {
  try {
    const payment = await PaymentModel.findOneAndUpdate(
      {
        _id: req.body?.paymentId,
        restaurantId: req.tableSession!.restaurantId,
      },
      {
        status: 'COMPLETED',
        verifiedAt: new Date(),
      },
      { new: true },
    );

    if (payment) {
      await OrderModel.findByIdAndUpdate(payment.orderId, {
        paymentStatus: 'PAID',
      });
    }

    ok(res, { payment, verified: Boolean(payment) });
  } catch (error) {
    next(error);
  }
});

customerRouter.get('/payments/:paymentId/status', async (req, res, next) => {
  try {
    const payment = await PaymentModel.findOne({
      _id: req.params.paymentId,
      restaurantId: req.tableSession!.restaurantId,
    });

    ok(res, { payment });
  } catch (error) {
    next(error);
  }
});

customerRouter.post('/feedback', async (req, res, next) => {
  try {
    const feedback = await FeedbackModel.create({
      restaurantId: req.tableSession!.restaurantId,
      sessionId: req.tableSession!._id,
      rating: Number(req.body?.rating ?? 5),
      comment: req.body?.comment ?? '',
    });

    ok(res, { feedback }, 201);
  } catch (error) {
    next(error);
  }
});

customerRouter.get('/feedback', async (req, res, next) => {
  try {
    const feedback = await FeedbackModel.find({
      restaurantId: req.tableSession!.restaurantId,
      sessionId: req.tableSession!._id,
    }).sort({ createdAt: -1 });

    ok(res, { feedback });
  } catch (error) {
    next(error);
  }
});

customerRouter.get('/loyalty', async (req, res, next) => {
  try {
    const visits = await TableSessionModel.countDocuments({
      restaurantId: req.tableSession!.restaurantId,
      mobile: req.tableSession!.mobile,
    });

    const points = visits * 120;
    const tier = points >= 500 ? 'Gold' : points >= 250 ? 'Silver' : 'Bronze';

    ok(res, {
      wallet: {
        points,
        tier,
        nextRewardAt: tier === 'Gold' ? points : tier === 'Silver' ? 500 : 250,
      },
    });
  } catch (error) {
    next(error);
  }
});

customerRouter.get('/offers', async (req, res, next) => {
  try {
    const offers = await OfferModel.find({
      restaurantId: req.tableSession!.restaurantId,
      active: true,
    }).sort({ createdAt: -1 });

    ok(res, { offers });
  } catch (error) {
    next(error);
  }
});

customerRouter.get('/offers/eligibility', async (req, res, next) => {
  try {
    const offers = await OfferModel.find({
      restaurantId: req.tableSession!.restaurantId,
      active: true,
    }).select('_id');

    ok(res, { eligibleOfferIds: offers.map((offer) => offer._id.toString()) });
  } catch (error) {
    next(error);
  }
});
