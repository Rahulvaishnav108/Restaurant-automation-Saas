import { Router } from 'express';
import { createId, store, type OrderStatus } from '../../services/demoStore';
import { ok } from '../../utils/responses';

export const kitchenRouter = Router();

kitchenRouter.get('/dashboard', (_req, res) => {
  ok(res, {
    metrics: {
      activeOrders: store.orders.filter((order) => ['PLACED', 'ACCEPTED', 'PREPARING', 'DELAYED'].includes(order.status)).length,
      readyOrders: store.orders.filter((order) => order.status === 'READY').length,
      activeBatches: store.kitchenBatches.filter((batch) => batch.status === 'ACTIVE').length,
      avgEtaMinutes: 14,
    },
  });
});

kitchenRouter.get('/orders', (req, res) => {
  const { status, priority, table, batch } = req.query;
  let orders = [...store.orders];
  if (status) orders = orders.filter((order) => order.status === String(status));
  if (priority) orders = orders.filter((order) => order.priority === String(priority));
  if (table) orders = orders.filter((order) => order.tableId === `tbl_${table}` || order.tableId === String(table));
  if (batch === 'true') orders = orders.filter((order) => Boolean(order.batchId));
  ok(res, { orders, count: orders.length });
});

kitchenRouter.get('/orders/:id', (req, res) => {
  ok(res, { order: store.orders.find((order) => order.id === req.params.id) ?? null });
});

['accept', 'start', 'ready', 'delay', 'reject'].forEach((action) => {
  kitchenRouter.patch(`/orders/:id/${action}`, (req, res) => {
    const order = store.orders.find((entry) => entry.id === req.params.id);
    if (order) {
      const nextStatusMap: Record<string, OrderStatus> = {
        accept: 'ACCEPTED',
        start: 'PREPARING',
        ready: 'READY',
        delay: 'DELAYED',
        reject: 'CANCELLED',
      };
      order.status = nextStatusMap[action];
    }
    ok(res, { order: order ?? null, updatedBy: req.body?.staffId ?? 'usr_kitchen_1' });
  });
});

kitchenRouter.get('/batches', (_req, res) => {
  ok(res, { batches: store.kitchenBatches });
});

kitchenRouter.get('/batches/:id', (req, res) => {
  ok(res, { batch: store.kitchenBatches.find((batch) => batch.id === req.params.id) ?? null });
});

kitchenRouter.post('/batches', (req, res) => {
  const batch = {
    id: createId('batch'),
    restaurantId: 'rest_1',
    name: req.body?.name ?? 'New Batch',
    orderIds: Array.isArray(req.body?.orderIds) ? req.body.orderIds : [],
    status: 'ACTIVE',
    station: req.body?.station ?? 'Hot Line',
  };
  store.kitchenBatches.push(batch);
  ok(res, { batch }, 201);
});

kitchenRouter.patch('/batches/:id', (req, res) => {
  const batch = store.kitchenBatches.find((entry) => entry.id === req.params.id);
  if (batch) {
    batch.name = req.body?.name ?? batch.name;
    batch.status = req.body?.status ?? batch.status;
  }
  ok(res, { batch: batch ?? null });
});

kitchenRouter.get('/load', (_req, res) => {
  ok(res, {
    stations: [
      { station: 'Hot Line', loadPercent: 84 },
      { station: 'Cold Pass', loadPercent: 43 },
      { station: 'Dessert', loadPercent: 22 },
    ],
  });
});

kitchenRouter.get('/performance', (_req, res) => {
  ok(res, {
    chefs: [
      { name: 'Kabir Kitchen', avgTicketMinutes: 11, completionRate: 0.94 },
      { name: 'Tanya Prep', avgTicketMinutes: 13, completionRate: 0.91 },
    ],
  });
});
