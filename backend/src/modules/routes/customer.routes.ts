import { Router } from 'express';
import { createId, getCurrentCustomerSession, store, type OrderStatus, type RequestStatus } from '../../services/demoStore';
import { ok } from '../../utils/responses';

export const customerRouter = Router();

customerRouter.get('/session', (_req, res) => {
  ok(res, { session: getCurrentCustomerSession() });
});

customerRouter.patch('/session/extend', (_req, res) => {
  const session = store.tableSessions[0];
  session.expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  ok(res, { session });
});

customerRouter.post('/session/end', (_req, res) => {
  const session = store.tableSessions[0];
  session.active = false;
  ok(res, { ended: true, sessionId: session.id });
});

customerRouter.get('/menu/categories', (_req, res) => {
  ok(res, { categories: store.menuCategories });
});

customerRouter.get('/menu/items', (req, res) => {
  const { veg, category, available, popular, recommended, search, priceMin, priceMax, sortBy } = req.query;
  let items = [...store.menuItems];
  if (veg !== undefined) items = items.filter((item) => item.veg === (veg === 'true'));
  if (category) items = items.filter((item) => item.category === String(category));
  if (available !== undefined) items = items.filter((item) => item.available === (available === 'true'));
  if (popular !== undefined) items = items.filter((item) => item.popular === (popular === 'true'));
  if (recommended !== undefined) items = items.filter((item) => item.recommended === (recommended === 'true'));
  if (search) items = items.filter((item) => item.name.toLowerCase().includes(String(search).toLowerCase()));
  if (priceMin) items = items.filter((item) => item.price >= Number(priceMin));
  if (priceMax) items = items.filter((item) => item.price <= Number(priceMax));
  if (sortBy === 'price') items = items.sort((a, b) => a.price - b.price);
  ok(res, { items, count: items.length });
});

customerRouter.get('/menu/items/:id', (req, res) => {
  ok(res, { item: store.menuItems.find((item) => item.id === req.params.id) ?? null });
});

customerRouter.get('/cart', (_req, res) => {
  ok(res, { items: store.cart, itemCount: store.cart.length });
});

customerRouter.post('/cart/items', (req, res) => {
  const item = {
    id: createId('cart'),
    sessionId: store.tableSessions[0]?.id ?? 'ts_1',
    itemId: req.body?.itemId ?? 'item_1',
    quantity: Number(req.body?.quantity ?? 1),
    addOns: Array.isArray(req.body?.addOns) ? req.body.addOns : [],
    note: req.body?.note ?? '',
  };
  store.cart.push(item);
  ok(res, { item }, 201);
});

customerRouter.patch('/cart/items/:itemId', (req, res) => {
  const item = store.cart.find((entry) => entry.id === req.params.itemId);
  if (item) {
    item.quantity = Number(req.body?.quantity ?? item.quantity);
    item.note = req.body?.note ?? item.note;
  }
  ok(res, { item: item ?? null });
});

customerRouter.delete('/cart/items/:itemId', (req, res) => {
  store.cart = store.cart.filter((entry) => entry.id !== req.params.itemId);
  ok(res, { removedItemId: req.params.itemId });
});

customerRouter.delete('/cart', (_req, res) => {
  store.cart = [];
  ok(res, { cleared: true });
});

customerRouter.post('/orders', (_req, res) => {
  const order = {
    id: createId('ord'),
    restaurantId: 'rest_1',
    sessionId: store.tableSessions[0]?.id ?? 'ts_1',
    tableId: store.tableSessions[0]?.tableId ?? 'tbl_1',
    status: 'PLACED' as OrderStatus,
    priority: 'MEDIUM',
    batchId: null as string | null,
    total: store.cart.reduce((sum, item) => {
      const menuItem = store.menuItems.find((entry) => entry.id === item.itemId);
      return sum + (menuItem?.price ?? 0) * item.quantity;
    }, 0),
    createdAt: new Date().toISOString(),
    picked: false,
    served: false,
  };
  store.orders.push(order);
  ok(res, { order }, 201);
});

customerRouter.get('/orders', (req, res) => {
  const { status, page, limit } = req.query;
  let orders = [...store.orders];
  if (status) orders = orders.filter((order) => order.status === String(status));
  const pageNumber = Number(page ?? 1);
  const limitNumber = Number(limit ?? (orders.length || 10));
  const paged = orders.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);
  ok(res, { orders: paged, pagination: { page: pageNumber, limit: limitNumber, total: orders.length } });
});

customerRouter.get('/orders/:id', (req, res) => {
  ok(res, { order: store.orders.find((order) => order.id === req.params.id) ?? null });
});

customerRouter.post('/orders/:id/reorder', (req, res) => {
  const original = store.orders.find((order) => order.id === req.params.id);
  const order = original
    ? { ...original, id: createId('ord'), createdAt: new Date().toISOString(), status: 'PLACED' as OrderStatus }
    : null;
  if (order) store.orders.push(order);
  ok(res, { order });
});

customerRouter.post('/orders/:id/cancel', (req, res) => {
  const order = store.orders.find((entry) => entry.id === req.params.id);
  if (order) order.status = 'CANCELLED';
  ok(res, { order: order ?? null });
});

['waiter', 'water', 'cutlery', 'cleaning', 'help'].forEach((type) => {
  customerRouter.post(`/requests/${type}`, (_req, res) => {
    const request = {
      id: createId('req'),
      restaurantId: 'rest_1',
      sessionId: store.tableSessions[0]?.id ?? 'ts_1',
      type,
      status: 'PENDING' as RequestStatus,
      priority: type === 'waiter' || type === 'help' ? 'HIGH' : 'MEDIUM',
      tableId: store.tableSessions[0]?.tableId ?? 'tbl_1',
    };
    store.staffRequests.push(request);
    ok(res, { request }, 201);
  });
});

customerRouter.get('/bill', (_req, res) => {
  const subtotal = store.orders.filter((order) => order.status !== 'CANCELLED').reduce((sum, order) => sum + order.total, 0);
  const discount = 64;
  const tax = subtotal * 0.05;
  ok(res, { bill: { subtotal, discount, tax, total: subtotal - discount + tax } });
});

customerRouter.post('/bill/request', (_req, res) => {
  ok(res, { requested: true, etaMinutes: 4 });
});

customerRouter.post('/bill/coupon', (req, res) => {
  ok(res, { appliedCoupon: req.body?.code ?? 'LUNCH10', savings: 64 });
});

customerRouter.delete('/bill/coupon/:couponId', (req, res) => {
  ok(res, { removedCouponId: req.params.couponId });
});

customerRouter.post('/payments/create', (req, res) => {
  const payment = {
    id: createId('pay'),
    orderId: req.body?.orderId ?? 'ord_1',
    status: 'PENDING',
    amount: Number(req.body?.amount ?? 640),
    method: req.body?.method ?? 'UPI',
  };
  store.payments.push(payment);
  ok(res, { payment }, 201);
});

customerRouter.post('/payments/verify', (req, res) => {
  const payment = store.payments.find((entry) => entry.id === req.body?.paymentId);
  if (payment) payment.status = 'CONFIRMED';
  ok(res, { payment: payment ?? null, verified: Boolean(payment) });
});

customerRouter.get('/payments/:paymentId/status', (req, res) => {
  ok(res, { payment: store.payments.find((entry) => entry.id === req.params.paymentId) ?? null });
});

customerRouter.post('/feedback', (req, res) => {
  const entry = {
    id: createId('fb'),
    restaurantId: 'rest_1',
    sessionId: store.tableSessions[0]?.id ?? 'ts_1',
    rating: Number(req.body?.rating ?? 5),
    comment: req.body?.comment ?? '',
  };
  store.feedback.push(entry);
  ok(res, { feedback: entry }, 201);
});

customerRouter.get('/feedback', (_req, res) => {
  ok(res, { feedback: store.feedback });
});

customerRouter.get('/loyalty', (_req, res) => {
  ok(res, {
    wallet: {
      points: 240,
      tier: 'Silver',
      nextRewardAt: 300,
    },
  });
});

customerRouter.get('/offers', (_req, res) => {
  ok(res, { offers: store.offers.filter((offer) => offer.active) });
});

customerRouter.get('/offers/eligibility', (_req, res) => {
  ok(res, { eligibleOfferIds: store.offers.filter((offer) => offer.active).map((offer) => offer.id) });
});
