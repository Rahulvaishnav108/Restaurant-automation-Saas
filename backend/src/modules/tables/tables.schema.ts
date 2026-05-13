import { z } from 'zod';

const tablePayloadSchema = z.object({
  name: z.string().trim().min(1),
  number: z.coerce.number().int().positive(),
  floor: z.coerce.number().int().min(0).default(1),
  section: z.string().trim().min(1).default('Main'),
  capacity: z.coerce.number().int().positive().max(20),
  assignedStaffId: z.string().trim().min(1).nullable().optional(),
});

export const createTableRequestSchema = z.object({
  body: tablePayloadSchema,
  params: z.object({}),
  query: z.object({}),
});

export const updateTableRequestSchema = z.object({
  body: tablePayloadSchema.partial(),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}),
});

export const bulkCreateTablesRequestSchema = z.object({
  body: z.object({
    tables: z.array(tablePayloadSchema).min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});
