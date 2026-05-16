import { Router } from 'express';
import { TableModel } from '../tables/tables.model';
import { QueueEntryModel } from '../queue/queue.model';
import { ReservationModel } from '../reservations/reservations.model';
import { StaffRequestModel } from '../staff/staffRequest.model';
import { AuditLogModel } from '../auditLogs/auditLogs.model';
import { OrderModel } from '../orders/orders.model';
import { ok } from '../../utils/responses';
import { OrderStatus } from '../orders/orders.schema';
import { RequestStatus, TableStatus } from '../../constants/statuses';

export const staffRouter = Router();

staffRouter.get('/tables', async (req, res, next) => {
  try {
    const restaurantId = req.user?.restaurantId;
    const { status, floor, section } = req.query;
    const query: Record<string, unknown> = { restaurantId };

    if (status) query.status = status;
    if (floor) query.floor = Number(floor);
    if (section) query.section = String(section);

    const tables = await TableModel.find(query).sort({ floor: 1, tableNumber: 1 });
    ok(res, { tables, count: tables.length });
  } catch (error) {
    next(error);
  }
});

staffRouter.get('/tables/:id', async (req, res, next) => {
  try {
    const table = await TableModel.findOne({
      _id: req.params.id,
      restaurantId: req.user?.restaurantId,
    });
    ok(res, { table });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/tables/:id/assign', async (req, res, next) => {
  try {
    const table = await TableModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        assignedStaffId: req.body?.staffId ?? req.user?.id ?? null,
      },
      { new: true },
    );

    ok(res, { table });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/tables/:id/reserve', async (req, res, next) => {
  try {
    const table = await TableModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: TableStatus.RESERVED,
      },
      { new: true },
    );

    ok(res, { table, reservationId: req.body?.reservationId ?? null });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/tables/:id/occupy', async (req, res, next) => {
  try {
    const table = await TableModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: TableStatus.OCCUPIED,
      },
      { new: true },
    );

    ok(res, { table });
  } catch (error) {
    next(error);
  }
});

staffRouter.get('/queue', async (req, res, next) => {
  try {
    const entries = await QueueEntryModel.find({
      restaurantId: req.user?.restaurantId,
    }).sort({ createdAt: 1 });

    ok(res, { entries });
  } catch (error) {
    next(error);
  }
});

staffRouter.get('/queue/:id', async (req, res, next) => {
  try {
    const entry = await QueueEntryModel.findOne({
      _id: req.params.id,
      restaurantId: req.user?.restaurantId,
    });

    ok(res, { entry });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/queue/:id/priority', async (req, res, next) => {
  try {
    const entry = await QueueEntryModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        priority: req.body?.priority,
      },
      { new: true },
    );

    ok(res, { entry });
  } catch (error) {
    next(error);
  }
});

staffRouter.get('/reservations', async (req, res, next) => {
  try {
    const reservations = await ReservationModel.find({
      restaurantId: req.user?.restaurantId,
    }).sort({ date: 1, slot: 1 });

    ok(res, { reservations });
  } catch (error) {
    next(error);
  }
});

staffRouter.get('/reservations/:id', async (req, res, next) => {
  try {
    const reservation = await ReservationModel.findOne({
      _id: req.params.id,
      restaurantId: req.user?.restaurantId,
    });

    ok(res, { reservation });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/reservations/:id/check-in', async (req, res, next) => {
  try {
    const reservation = await ReservationModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: 'CHECKED_IN',
      },
      { new: true },
    );

    ok(res, { reservation, checkedInBy: req.body?.staffId ?? req.user?.id ?? null });
  } catch (error) {
    next(error);
  }
});

staffRouter.get('/orders/ready', async (req, res, next) => {
  try {
    const orders = await OrderModel.find({
      restaurantId: req.user?.restaurantId,
      status: OrderStatus.READY,
    }).sort({ updatedAt: 1 });

    ok(res, { orders });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/orders/:id/pick', async (req, res, next) => {
  try {
    const order = await OrderModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
        status: OrderStatus.READY,
      },
      { status: OrderStatus.PICKED },
      { new: true },
    );

    ok(res, { order, pickedBy: req.body?.staffId ?? req.user?.id ?? null });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/orders/:id/serve', async (req, res, next) => {
  try {
    const order = await OrderModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
        status: { $in: [OrderStatus.READY, OrderStatus.PICKED] },
      },
      {
        status: OrderStatus.SERVED,
        servedAt: new Date(),
      },
      { new: true },
    );

    ok(res, { order });
  } catch (error) {
    next(error);
  }
});

staffRouter.get('/requests', async (req, res, next) => {
  try {
    const requests = await StaffRequestModel.find({
      restaurantId: req.user?.restaurantId,
    }).sort({ createdAt: -1 });

    ok(res, { requests });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/requests/:id/accept', async (req, res, next) => {
  try {
    const request = await StaffRequestModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: RequestStatus.ACCEPTED,
        acceptedBy: req.body?.staffId ?? req.user?.id ?? null,
      },
      { new: true },
    );

    ok(res, { request, acceptedBy: req.body?.staffId ?? req.user?.id ?? null });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch('/requests/:id/complete', async (req, res, next) => {
  try {
    const request = await StaffRequestModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: RequestStatus.COMPLETED,
        completedBy: req.user?.id ?? null,
      },
      { new: true },
    );

    ok(res, { request });
  } catch (error) {
    next(error);
  }
});

staffRouter.post('/issues/escalate', async (req, res, next) => {
  try {
    const escalation = await AuditLogModel.create({
      actorId: req.body?.staffId ?? req.user?.id ?? null,
      action: 'ESCALATE_ISSUE',
      entityId: req.body?.entityId ?? 'unknown',
      metadata: {
        restaurantId: req.user?.restaurantId,
      },
    });

    ok(res, { escalation }, 201);
  } catch (error) {
    next(error);
  }
});
