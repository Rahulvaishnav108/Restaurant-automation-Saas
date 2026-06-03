import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid MongoDB ObjectId',
});

export const getAuditLogsQuerySchema = z.object({
  restaurantId: objectIdSchema.optional(),
  role: z.string().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
  // Accept both ISO datetime string and simple YYYY-MM-DD format
  from: z.string().datetime({ precision: 3, offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  to: z.string().datetime({ precision: 3, offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
});

export const getAuditLogByIdParamsSchema = z.object({
  id: objectIdSchema,
});
