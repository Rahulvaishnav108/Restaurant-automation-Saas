import { Router } from 'express';
import { ok } from '../../utils/responses';
import { KitchenBatchModel } from '../kitchen/kitchen.model';
import { OrderModel } from '../orders/orders.model';
import { BatchStatus } from '../../constants/statuses';
import { OrderStatus } from '../orders/orders.schema';

export const kitchenRouter = Router();

kitchenRouter.get('/dashboard', async (req, res, next) => {
  try {
    const restaurantId = req.user?.restaurantId;

    const [activeOrders, readyOrders, activeBatches] = await Promise.all([
      OrderModel.countDocuments({
        restaurantId,
        status: { $in: [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.DELAYED] },
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

kitchenRouter.get('/orders', async (req, res, next) => {
  try {
    const { status, priority, table, batch } = req.query;
    const query: Record<string, unknown> = {
      restaurantId: req.user?.restaurantId,
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (table) query.tableId = table;
    if (batch === 'true') query.batchId = { $ne: null };

    const orders = await OrderModel.find(query).sort({ createdAt: 1 });
    ok(res, { orders, count: orders.length });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
      restaurantId: req.user?.restaurantId,
    });

    ok(res, { order });
  } catch (error) {
    next(error);
  }
});

const statusTransitions: Record<string, OrderStatus> = {
  accept: OrderStatus.ACCEPTED,
  start: OrderStatus.PREPARING,
  ready: OrderStatus.READY,
  delay: OrderStatus.DELAYED,
  reject: OrderStatus.REJECTED,
};

for (const action of Object.keys(statusTransitions)) {
  kitchenRouter.patch(`/orders/:id/${action}`, async (req, res, next) => {
    try {
      const update: Record<string, unknown> = {
        status: statusTransitions[action],
      };

      if (action === 'accept' && req.body?.estimatedPreparationTime !== undefined) {
        update.estimatedPreparationTime = Number(req.body.estimatedPreparationTime);
        update.acceptedAt = new Date();
      }

      if (action === 'ready') {
        update.readyAt = new Date();
      }

      if (action === 'delay' && req.body?.delayMinutes !== undefined) {
        update.estimatedPreparationTime = Number(req.body.delayMinutes);
      }

      if (action === 'reject') {
        update.rejectionReason = req.body?.reason ?? 'Rejected by kitchen';
        update.cancelledAt = new Date();
      }

      const order = await OrderModel.findOneAndUpdate(
        {
          _id: req.params.id,
          restaurantId: req.user?.restaurantId,
        },
        update,
        { new: true },
      );

      ok(res, { order, updatedBy: req.body?.staffId ?? req.user?.id ?? null });
    } catch (error) {
      next(error);
    }
  });
}

kitchenRouter.get('/batches', async (req, res, next) => {
  try {
    const batches = await KitchenBatchModel.find({
      restaurantId: req.user?.restaurantId,
    }).sort({ createdAt: -1 });

    ok(res, { batches });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.get('/batches/:id', async (req, res, next) => {
  try {
    const batch = await KitchenBatchModel.findOne({
      _id: req.params.id,
      restaurantId: req.user?.restaurantId,
    });

    ok(res, { batch });
  } catch (error) {
    next(error);
  }
});

kitchenRouter.post('/batches', async (req, res, next) => {
  try {
    const batch = await KitchenBatchModel.create({
      restaurantId: req.user?.restaurantId,
      name: req.body?.name ?? 'New Batch',
      orderIds: Array.isArray(req.body?.orderIds) ? req.body.orderIds : [],
      status: BatchStatus.IN_PROGRESS,
      station: req.body?.station ?? 'Hot Line',
    });

    await OrderModel.updateMany(
      {
        _id: { $in: batch.orderIds },
        restaurantId: req.user?.restaurantId,
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

kitchenRouter.patch('/batches/:id', async (req, res, next) => {
  try {
    const batch = await KitchenBatchModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        name: req.body?.name,
        status: req.body?.status,
        station: req.body?.station,
      },
      { new: true },
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

    ok(res, { stations });
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

    ok(res, { chefs: kitchenUsers });
  } catch (error) {
    next(error);
  }
});
