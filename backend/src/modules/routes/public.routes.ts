import { Router } from 'express';
import { getPublicRestaurantController } from '../restaurants/restaurants.controller';
import {
  createTableSessionController,
  validateTableSessionController,
} from '../tableSessions/tableSessions.controller';
import {
  createTableSessionRequestSchema,
  validateTableSessionRequestSchema,
} from '../tableSessions/tableSessions.schema';
import { validate } from '../../middleware/validate';
import { ok } from '../../utils/responses';

export const publicRouter = Router();

publicRouter.get('/restaurants/:slug', getPublicRestaurantController);

publicRouter.post(
  '/table-session/validate',
  validate(validateTableSessionRequestSchema),
  validateTableSessionController,
);

publicRouter.post(
  '/table-session/create',
  validate(createTableSessionRequestSchema),
  createTableSessionController,
);

publicRouter.get('/reservations/availability', (req, res) => {
  ok(res, {
    restaurantId: req.query.restaurantId ?? 'rest_1',
    date: req.query.date ?? new Date().toISOString().slice(0, 10),
    guests: Number(req.query.guests ?? 2),
    slots: ['19:00', '19:30', '20:00', '21:00'],
  });
});

publicRouter.post('/queue/join', (req, res) => {
  ok(
    res,
    {
      queueEntry: {
        id: 'queue_demo_1',
        restaurantId: req.body?.restaurantId ?? 'rest_1',
        customerName: req.body?.customerName ?? 'Walk-in Guest',
        guests: Number(req.body?.guests ?? 2),
        priority: 'MEDIUM',
        status: 'WAITING',
        etaMinutes: 15,
      },
    },
    201,
  );
});
