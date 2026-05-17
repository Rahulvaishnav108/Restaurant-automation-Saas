import { Types } from 'mongoose';
import { z } from 'zod';
import { Priority, TableStatus } from '../../constants/statuses';

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid id',
});

const nullableObjectIdSchema = z.union([objectIdSchema, z.null()]);

export const entityIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const staffTablesQuerySchema = z.object({
  status: z.nativeEnum(TableStatus).optional(),
  floor: z.coerce.number().int().min(0).optional(),
  section: z.string().trim().min(1).optional(),
});

export const assignTableBodySchema = z.object({
  staffId: nullableObjectIdSchema.optional(),
});

export const reserveTableBodySchema = z.object({
  reservationId: nullableObjectIdSchema.optional(),
});

export const occupyTableBodySchema = z.object({
  sessionId: nullableObjectIdSchema.optional(),
  staffId: nullableObjectIdSchema.optional(),
});

export const queuePriorityBodySchema = z.object({
  priority: z.nativeEnum(Priority),
});

export const reservationCheckInBodySchema = z.object({
  staffId: nullableObjectIdSchema.optional(),
});

export const requestAcceptBodySchema = z.object({
  staffId: nullableObjectIdSchema.optional(),
});

export const requestCompleteBodySchema = z.object({
  staffId: nullableObjectIdSchema.optional(),
});

export const issueEscalationBodySchema = z.object({
  staffId: nullableObjectIdSchema.optional(),
  entityId: objectIdSchema,
  entityType: z.string().trim().min(1).max(100).optional(),
  notes: z.string().trim().min(1).max(500).optional(),
});
