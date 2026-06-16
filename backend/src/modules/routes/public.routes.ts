import { Router } from 'express';
import { getPublicRestaurantController } from '../restaurants/restaurants.controller';
import {
  createTableSessionController,
  recoverSession,
  validateTableSessionController,
} from '../tableSessions/tableSessions.controller';
import {
  createTableSessionRequestSchema,
  validateTableSessionRequestSchema,
} from '../tableSessions/tableSessions.schema';
import { validate } from '../../middleware/validate';
import { ok } from '../../utils/responses';
import { ReservationModel } from '../reservations/reservations.model';
import { TableModel } from '../tables/tables.model';
import { QueueEntryModel } from '../queue/queue.model';
import { Priority, QueueStatus, ReservationStatus } from '../../constants/statuses';
import { reservationAvailabilityQuerySchema } from '../reservations/reservations.schema';
import { publicQueueJoinBodySchema } from '../queue/queue.schema';
import { restaurantSlugParamSchema } from '../restaurants/restaurants.schema';

export const publicRouter = Router();

publicRouter.get('/restaurants/:slug', validate({ params: restaurantSlugParamSchema }), getPublicRestaurantController);

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

publicRouter.get('/table-session/recover', recoverSession);

publicRouter.get('/reservations/availability', validate({ query: reservationAvailabilityQuerySchema }), async (req, res, next) => {
  try {
    const restaurantId = String(req.query.restaurantId);
    const date = String(req.query.date ?? new Date().toISOString().slice(0, 10));
    const guests = Number(req.query.guests ?? 2);
    const baseSlots = ['19:00', '19:30', '20:00', '21:00'];

    const [tableCount, bookedReservations] = await Promise.all([
      restaurantId ? TableModel.countDocuments({ restaurantId, capacity: { $gte: guests } }) : 0,
      restaurantId
        ? ReservationModel.countDocuments({
            restaurantId,
            date,
            status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
          })
        : 0,
    ]);

    const slots = tableCount > bookedReservations ? baseSlots : baseSlots.slice(0, 2);

    ok(res, {
      restaurantId,
      date,
      guests,
      slots,
      meta: {
        count: slots.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

publicRouter.post('/queue/join', validate({ body: publicQueueJoinBodySchema }), async (req, res, next) => {
  try {
    const restaurantId = String(req.body.restaurantId);
    const currentQueueSize = await QueueEntryModel.countDocuments({ restaurantId, status: QueueStatus.WAITING });

    const queueEntry = await QueueEntryModel.create({
      restaurantId,
      customerName: req.body?.customerName ?? 'Walk-in Guest',
      guests: Number(req.body?.guests ?? 2),
      priority: Priority.NORMAL,
      status: QueueStatus.WAITING,
      etaMinutes: 10 + currentQueueSize * 5,
    });

    ok(res, { queueEntry }, 201);
  } catch (error) {
    next(error);
  }
});
