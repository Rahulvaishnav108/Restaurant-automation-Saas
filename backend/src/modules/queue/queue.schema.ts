import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid restaurant id',
});

export const publicQueueJoinBodySchema = z.object({
  restaurantId: objectIdSchema,
  customerName: z.string().trim().min(1).max(100).default('Walk-in Guest'),
  guests: z.coerce.number().int().min(1).max(20).default(2),
});
