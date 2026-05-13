import { Router } from 'express';
import { createId, store } from '../../services/demoStore';
import { ok } from '../../utils/responses';

export const sharedRouter = Router();

sharedRouter.get('/notifications', (_req, res) => {
  ok(res, { notifications: store.notifications });
});

sharedRouter.patch('/notifications/:id/read', (req, res) => {
  const notification = store.notifications.find((entry) => entry.id === req.params.id);
  if (notification) notification.read = true;
  ok(res, { notification: notification ?? null });
});

sharedRouter.patch('/notifications/read-all', (_req, res) => {
  store.notifications = store.notifications.map((notification) => ({ ...notification, read: true }));
  ok(res, { readAll: true });
});

sharedRouter.post('/uploads', (req, res) => {
  ok(
    res,
    {
      upload: {
        id: createId('upload'),
        fileName: req.body?.fileName ?? 'placeholder.png',
        url: `https://cdn.domain.com/uploads/${req.body?.fileName ?? 'placeholder.png'}`,
      },
    },
    201,
  );
});

sharedRouter.get('/search', (req, res) => {
  const query = String(req.query.q ?? '').toLowerCase();
  const menuItems = store.menuItems.filter((item) => item.name.toLowerCase().includes(query));
  const restaurants = store.restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(query));
  ok(res, { query, menuItems, restaurants });
});

sharedRouter.get('/version', (_req, res) => {
  ok(res, {
    version: {
      api: 'v1',
      releaseDate: '2026-05-11',
      contract: 'restaurant_automation_final_prd.md',
    },
  });
});
