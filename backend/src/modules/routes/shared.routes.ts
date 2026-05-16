import { Router } from 'express';
import { ok } from '../../utils/responses';
import { NotificationModel } from '../notifications/notifications.model';
import { MenuItem } from '../menu/menu.model';
import { RestaurantModel } from '../restaurants/restaurants.model';

export const sharedRouter = Router();

sharedRouter.get('/notifications', async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find({
      userId: req.user?.id,
    }).sort({ createdAt: -1 });

    ok(res, { notifications });
  } catch (error) {
    next(error);
  }
});

sharedRouter.patch('/notifications/:id/read', async (req, res, next) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user?.id,
      },
      { read: true },
      { new: true },
    );

    ok(res, { notification });
  } catch (error) {
    next(error);
  }
});

sharedRouter.patch('/notifications/read-all', async (req, res, next) => {
  try {
    await NotificationModel.updateMany(
      {
        userId: req.user?.id,
      },
      { read: true },
    );

    ok(res, { readAll: true });
  } catch (error) {
    next(error);
  }
});

sharedRouter.post('/uploads', (req, res) => {
  ok(
    res,
    {
      upload: {
        id: `upload_${Date.now()}`,
        fileName: req.body?.fileName ?? 'placeholder.png',
        url: `/uploads/${req.body?.fileName ?? 'placeholder.png'}`,
      },
    },
    201,
  );
});

sharedRouter.get('/search', async (req, res, next) => {
  try {
    const query = String(req.query.q ?? '').trim();

    const [menuItems, restaurants] = await Promise.all([
      MenuItem.find({ name: { $regex: query, $options: 'i' } })
        .select('name price isVeg isAvailable')
        .limit(10),
      RestaurantModel.find({ name: { $regex: query, $options: 'i' } })
        .select('name slug city cuisine status')
        .limit(10),
    ]);

    ok(res, { query, menuItems, restaurants });
  } catch (error) {
    next(error);
  }
});

sharedRouter.get('/version', (_req, res) => {
  ok(res, {
    version: {
      api: 'v1',
      releaseDate: '2026-05-16',
      contract: 'restaurant_automation_rolewise_postman_and_prd.md',
    },
  });
});
