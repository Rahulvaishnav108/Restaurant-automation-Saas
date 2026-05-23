import { Router } from 'express';
import { requireSession } from '../../middleware/requireSession';
import { validate } from '../../middleware/validate';
import { ok } from '../../utils/responses';
import { endSession } from '../tableSessions/tableSessions.service';
import { TableSessionModel } from '../tableSessions/tableSessions.model';
import { FeedbackModel } from '../feedback/feedback.model';
import { OfferModel } from '../offers/offers.model';
import { StaffRequestModel } from '../staff/staffRequest.model';
import { Priority, RequestStatus, RequestType } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { feedbackBodySchema } from './customer.schema';

export const customerRouter = Router();

customerRouter.use(requireSession);

function ensureFound<T>(value: T | null | undefined, message: string): T {
  if (!value) {
    throw new AppError(message, 404, ErrorCode.NOT_FOUND);
  }

  return value;
}

customerRouter.get('/session', async (req, res, next) => {
  try {
    const session = ensureFound(
      await TableSessionModel.findOne({
        _id: req.tableSession!._id,
        restaurantId: req.tableSession!.restaurantId,
      }),
      'Session not found',
    );
    ok(res, { session });
  } catch (error) {
    next(error);
  }
});

customerRouter.patch('/session/extend', async (req, res, next) => {
  try {
    const existingSession = await TableSessionModel.findOne({
      _id: req.tableSession!._id,
      restaurantId: req.tableSession!.restaurantId,
    });
    const session = ensureFound(
      existingSession,
      'Session not found',
    );

    const baseline = session.expiresAt.getTime() > Date.now() ? session.expiresAt.getTime() : Date.now();
    session.expiresAt = new Date(baseline + 30 * 60 * 1000);
    session.lastActivityAt = new Date();
    await session.save();

    ok(res, { session });
  } catch (error) {
    next(error);
  }
});

customerRouter.post('/session/end', async (req, res, next) => {
  try {
    const session = await endSession(
      req.tableSession!._id,
      'customer_closed',
      req.tableSession!.restaurantId.toString(),
    );
    ok(res, { session });
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



customerRouter.post('/feedback', validate({ body: feedbackBodySchema }), async (req, res, next) => {
  try {
    const feedback = await FeedbackModel.create({
      restaurantId: req.tableSession!.restaurantId,
      sessionId: req.tableSession!._id,
      rating: Number(req.body.rating),
      comment: req.body.comment ?? '',
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

    ok(res, {
      feedback,
      meta: {
        count: feedback.length,
      },
    });
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

    ok(res, {
      offers,
      meta: {
        count: offers.length,
      },
    });
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

    const eligibleOfferIds = offers.map((offer) => offer._id.toString());

    ok(res, {
      eligibleOfferIds,
      meta: {
        count: eligibleOfferIds.length,
      },
    });
  } catch (error) {
    next(error);
  }
});
