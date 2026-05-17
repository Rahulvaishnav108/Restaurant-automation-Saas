import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid restaurant id',
});

export const reservationAvailabilityQuerySchema = z.object({
  restaurantId: objectIdSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  guests: z.coerce.number().int().min(1).max(20).optional(),
});
