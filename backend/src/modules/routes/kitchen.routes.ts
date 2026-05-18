import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { ok } from '../../utils/responses';
import { KitchenBatchModel } from '../kitchen/kitchen.model';
import { OrderModel } from '../orders/orders.model';
import { BatchStatus } from '../../constants/statuses';
import { OrderStatus } from '../orders/orders.schema';
import {
  createKitchenBatchBodySchema,
  kitchenBatchParamsSchema,
  updateKitchenBatchBodySchema,
} from '../kitchen/kitchen.schema';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

export const kitchenRouter = Router();

function ensureFound<T>(value: T | null | undefined, message: string): T {
  if (!value) {
    throw new AppError(message, 404, ErrorCode.NOT_FOUND);
  }

  return value;
}

kitchenRouter.get('/dashboard', async (req, res, next) => {
  try {
    const restaurantId = req.user?.restaurantId;

    const [activeOrders, readyOrders, activeBatches] = await Promise.all([
      OrderModel.countDocuments({
        restaurantId,
        status: { $in: [OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.DELAYED] },
      }),
      OrderModel.countDocuments({ restaurantId, status: OrderStatus.READY }),
      KitchenBatchModel.countDocuments({ restaurantId, status: BatchStatus.IN_PROGRESS }),
    ]);

    const preparingOrders = await OrderModel.find({
      restaurantId,
      estimatedPreparationTime: { $ne: null },
    }).select('estimatedPreparationTime');

    const avgEtaMinutes =
      preparingOrders.length > 0
        ? Math.round(
            preparingOrders.reduce((sum, order) => sum + Number(order.estimatedPreparationTime ?? 0), 0) /
              preparingOrders.length,
          )
        : 0;

    ok(res, {
      metrics: {
        activeOrders,
        readyOrders,
        activeBatches,
        avgEtaMinutes,
      },
    });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.get('/batches', async (req, res, next) => {
  try {
    const batches = await KitchenBatchModel.find({
      restaurantId: req.user?.restaurantId,
    }).sort({ createdAt: -1 });

    ok(res, {
      batches,
      meta: {
        count: batches.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.get('/batches/:id', validate({ params: kitchenBatchParamsSchema }), async (req, res, next) => {
  try {
    const batch = ensureFound(
      await KitchenBatchModel.findOne({
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      }),
      'Kitchen batch not found',
    );

    ok(res, { batch });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.post('/batches', validate({ body: createKitchenBatchBodySchema }), async (req, res, next) => {
  try {
    const restaurantId = req.user?.restaurantId;
    const orders = await OrderModel.find({
      _id: { $in: req.body.orderIds },
      restaurantId,
    }).select('_id');

    if (orders.length !== req.body.orderIds.length) {
      throw new AppError('One or more orders do not belong to this restaurant', 400, ErrorCode.INVALID_REQUEST);
    }

    const batch = await KitchenBatchModel.create({
      restaurantId,
      name: req.body.name,
      orderIds: orders.map((order) => order._id),
      status: BatchStatus.IN_PROGRESS,
      station: req.body.station,
    });

    await OrderModel.updateMany(
      {
        _id: { $in: batch.orderIds },
        restaurantId,
      },
      {
        batchId: batch._id,
      },
    );

    ok(res, { batch }, 201);
  } catch (error) {
    next(error);
  }
});

kitchenRouter.patch(
  '/batches/:id',
  validate({ params: kitchenBatchParamsSchema, body: updateKitchenBatchBodySchema }),
  async (req, res, next) => {
  try {
    const batch = ensureFound(
      await KitchenBatchModel.findOneAndUpdate(
        {
          _id: req.params.id,
          restaurantId: req.user?.restaurantId,
        },
        {
          name: req.body.name,
          status: req.body.status,
          station: req.body.station,
        },
        { new: true, runValidators: true },
      ),
      'Kitchen batch not found',
    );

    ok(res, { batch });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.get('/load', async (req, res, next) => {
  try {
    const batches = await KitchenBatchModel.find({
      restaurantId: req.user?.restaurantId,
    }).select('station status');

    const stations = ['Hot Line', 'Cold Pass', 'Dessert'].map((station) => {
      const stationLoad = batches.filter((batch) => batch.station === station).length;
      return {
        station,
        loadPercent: Math.min(100, stationLoad * 30),
      };
    });

    ok(res, {
      stations,
      meta: {
        count: stations.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.get('/performance', async (req, res, next) => {
  try {
    const kitchenUsers = [
      { name: 'Kabir Kitchen', avgTicketMinutes: 11, completionRate: 0.94 },
      { name: 'Tanya Prep', avgTicketMinutes: 13, completionRate: 0.91 },
    ];

    ok(res, {
      chefs: kitchenUsers,
      meta: {
        count: kitchenUsers.length,
      },
    });
  } catch (error) {
    next(error);
  }
});
