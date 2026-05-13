import { Router } from 'express';
import { createId, store } from '../../services/demoStore';
import { ok } from '../../utils/responses';

export const superAdminRouter = Router();

superAdminRouter.get('/platform/overview', (_req, res) => {
  ok(res, {
    overview: {
      totalRestaurants: store.restaurants.length,
      activeRestaurants: store.restaurants.filter((restaurant) => restaurant.status === 'ACTIVE').length,
      monthlyRecurringRevenue: 824000,
      uptimePercent: 99.98,
    },
  });
});

superAdminRouter.get('/restaurants', (req, res) => {
  const { status, plan, search } = req.query;
  let restaurants = [...store.restaurants];
  if (status) restaurants = restaurants.filter((restaurant) => restaurant.status === String(status));
  if (plan) restaurants = restaurants.filter((restaurant) => restaurant.plan === String(plan));
  if (search) restaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(String(search).toLowerCase()));
  ok(res, { restaurants, count: restaurants.length });
});

superAdminRouter.get('/restaurants/:id', (req, res) => {
  ok(res, { restaurant: store.restaurants.find((restaurant) => restaurant.id === req.params.id) ?? null });
});

superAdminRouter.patch('/restaurants/:id/approve', (req, res) => {
  const restaurant = store.restaurants.find((entry) => entry.id === req.params.id);
  if (restaurant) restaurant.status = 'ACTIVE';
  ok(res, { restaurant: restaurant ?? null, approvedBy: req.body?.actorId ?? 'usr_super_1' });
});

superAdminRouter.patch('/restaurants/:id/suspend', (req, res) => {
  const restaurant = store.restaurants.find((entry) => entry.id === req.params.id);
  if (restaurant) restaurant.status = 'SUSPENDED';
  ok(res, { restaurant: restaurant ?? null, suspendedBy: req.body?.actorId ?? 'usr_super_1' });
});

superAdminRouter.delete('/restaurants/:id', (req, res) => {
  store.restaurants = store.restaurants.filter((restaurant) => restaurant.id !== req.params.id);
  ok(res, { deletedRestaurantId: req.params.id });
});

superAdminRouter.post('/plans', (req, res) => {
  const plan = {
    id: createId('plan'),
    name: req.body?.name ?? 'ENTERPRISE',
    priceMonthly: Number(req.body?.priceMonthly ?? 24999),
    tenantLimit: Number(req.body?.tenantLimit ?? 20),
  };
  store.plans.push(plan);
  ok(res, { plan }, 201);
});

superAdminRouter.get('/plans', (_req, res) => {
  ok(res, { plans: store.plans });
});

superAdminRouter.patch('/plans/:id', (req, res) => {
  const plan = store.plans.find((entry) => entry.id === req.params.id);
  if (plan) Object.assign(plan, req.body);
  ok(res, { plan: plan ?? null });
});

superAdminRouter.get('/analytics/revenue', (_req, res) => {
  ok(res, { revenue: [{ month: '2026-03', mrr: 760000 }, { month: '2026-04', mrr: 801000 }, { month: '2026-05', mrr: 824000 }] });
});

superAdminRouter.get('/analytics/tenants', (_req, res) => {
  ok(res, { tenants: { active: 128, suspended: 4, churnedThisMonth: 2 } });
});

superAdminRouter.get('/system/monitoring', (_req, res) => {
  ok(res, {
    system: {
      apiLatencyMsP95: 148,
      socketConnections: 412,
      errorRatePercent: 0.3,
      dbStatus: 'healthy',
    },
  });
});

superAdminRouter.get('/audit-logs', (req, res) => {
  const { actorId, action, from, to } = req.query;
  let logs = [...store.auditLogs];
  if (actorId) logs = logs.filter((log) => log.actorId === String(actorId));
  if (action) logs = logs.filter((log) => log.action === String(action));
  if (from) logs = logs.filter((log) => new Date(log.createdAt) >= new Date(String(from)));
  if (to) logs = logs.filter((log) => new Date(log.createdAt) <= new Date(String(to)));
  ok(res, { auditLogs: logs });
});

superAdminRouter.get('/feature-flags', (_req, res) => {
  ok(res, { featureFlags: store.featureFlags });
});

superAdminRouter.patch('/feature-flags/:id', (req, res) => {
  const flag = store.featureFlags.find((entry) => entry.id === req.params.id);
  if (flag) flag.enabled = Boolean(req.body?.enabled);
  ok(res, { featureFlag: flag ?? null });
});
