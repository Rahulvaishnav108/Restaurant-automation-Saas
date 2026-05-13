import { Router } from 'express';
import { createId, store } from '../../services/demoStore';
import { ok } from '../../utils/responses';

export const staffRouter = Router();

staffRouter.get('/tables', (req, res) => {
  const { status, floor, section } = req.query;
  let tables = [...store.tables];
  if (status) tables = tables.filter((table) => table.status === String(status));
  if (floor) tables = tables.filter((table) => table.floor === Number(floor));
  if (section) tables = tables.filter((table) => table.section === String(section));
  ok(res, { tables, count: tables.length });
});

staffRouter.get('/tables/:id', (req, res) => {
  ok(res, { table: store.tables.find((table) => table.id === req.params.id) ?? null });
});

staffRouter.patch('/tables/:id/assign', (req, res) => {
  const table = store.tables.find((entry) => entry.id === req.params.id);
  if (table) table.assignedStaffId = req.body?.staffId ?? 'usr_staff_1';
  ok(res, { table: table ?? null });
});

staffRouter.patch('/tables/:id/reserve', (req, res) => {
  const table = store.tables.find((entry) => entry.id === req.params.id);
  if (table) table.status = 'RESERVED';
  ok(res, { table: table ?? null, reservationId: req.body?.reservationId ?? null });
});

staffRouter.patch('/tables/:id/occupy', (req, res) => {
  const table = store.tables.find((entry) => entry.id === req.params.id);
  if (table) table.status = 'OCCUPIED';
  ok(res, { table: table ?? null });
});

staffRouter.get('/queue', (_req, res) => {
  ok(res, { entries: store.queueEntries });
});

staffRouter.get('/queue/:id', (req, res) => {
  ok(res, { entry: store.queueEntries.find((entry) => entry.id === req.params.id) ?? null });
});

staffRouter.patch('/queue/:id/priority', (req, res) => {
  const entry = store.queueEntries.find((item) => item.id === req.params.id);
  if (entry) entry.priority = req.body?.priority ?? entry.priority;
  ok(res, { entry: entry ?? null });
});

staffRouter.get('/reservations', (_req, res) => {
  ok(res, { reservations: store.reservations });
});

staffRouter.get('/reservations/:id', (req, res) => {
  ok(res, { reservation: store.reservations.find((entry) => entry.id === req.params.id) ?? null });
});

staffRouter.patch('/reservations/:id/check-in', (req, res) => {
  const reservation = store.reservations.find((entry) => entry.id === req.params.id);
  if (reservation) reservation.status = 'CHECKED_IN';
  ok(res, { reservation: reservation ?? null, checkedInBy: req.body?.staffId ?? 'usr_staff_1' });
});

staffRouter.get('/orders/ready', (_req, res) => {
  ok(res, { orders: store.orders.filter((order) => order.status === 'READY') });
});

staffRouter.patch('/orders/:id/pick', (req, res) => {
  const order = store.orders.find((entry) => entry.id === req.params.id);
  if (order) order.picked = true;
  ok(res, { order: order ?? null, pickedBy: req.body?.staffId ?? 'usr_staff_1' });
});

staffRouter.patch('/orders/:id/serve', (req, res) => {
  const order = store.orders.find((entry) => entry.id === req.params.id);
  if (order) {
    order.served = true;
    order.status = 'SERVED';
  }
  ok(res, { order: order ?? null });
});

staffRouter.get('/requests', (_req, res) => {
  ok(res, { requests: store.staffRequests });
});

staffRouter.patch('/requests/:id/accept', (req, res) => {
  const request = store.staffRequests.find((entry) => entry.id === req.params.id);
  if (request) request.status = 'ACCEPTED';
  ok(res, { request: request ?? null, acceptedBy: req.body?.staffId ?? 'usr_staff_1' });
});

staffRouter.patch('/requests/:id/complete', (req, res) => {
  const request = store.staffRequests.find((entry) => entry.id === req.params.id);
  if (request) request.status = 'COMPLETED';
  ok(res, { request: request ?? null });
});

staffRouter.post('/issues/escalate', (req, res) => {
  const audit = {
    id: createId('audit'),
    actorId: req.body?.staffId ?? 'usr_staff_1',
    action: 'ESCALATE_ISSUE',
    entityId: req.body?.entityId ?? 'tbl_1',
    createdAt: new Date().toISOString(),
  };
  store.auditLogs.push(audit);
  ok(res, { escalation: audit }, 201);
});
