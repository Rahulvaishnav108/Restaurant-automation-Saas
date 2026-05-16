import { z } from 'zod';
import { TableStatus } from '../../constants/statuses';

const tablePayloadSchema = z.object({
  name: z.string().trim().min(1).optional(),
  number: z.coerce.number().int().positive().optional(),
  tableNumber: z.string().trim().min(1).max(20).optional(),
  floor: z.coerce.number().int().min(0).default(1).optional(),
  section: z.string().trim().min(1).default('Main').optional(),
  restaurantId: z.string().trim().min(1).optional(),
  assignedStaffId: z.string().trim().min(1).nullable().optional(),
  qrCode: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
  capacity: z.coerce.number().int().positive().max(50),
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

export const createTableSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  tableNumber: z.string().min(1, 'Table number is required').max(20),
  capacity: z.coerce.number().int().min(1).max(50),
  qrCode: z.string().min(1, 'QR code identifier is required').optional(),
});

export const updateTableSchema = z.object({
  tableNumber: z.string().min(1).max(20).optional(),
  capacity: z.coerce.number().int().min(1).max(50).optional(),
  isActive: z.boolean().optional(),
});

export const updateTableStatusSchema = z.object({
  status: z.nativeEnum(TableStatus),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>;
