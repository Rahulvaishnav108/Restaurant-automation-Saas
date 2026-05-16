// src/modules/tables/tables.schema.ts
// Zod validation schemas for table endpoints

import { z } from 'zod';
import { TableStatus } from '../../constants/statuses';

export const createTableSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  tableNumber: z.string().min(1, 'Table number is required').max(20),
  capacity: z.number().int().min(1).max(50),
  qrCode: z.string().min(1, 'QR code identifier is required').optional(),
});

export const updateTableSchema = z.object({
  tableNumber: z.string().min(1).max(20).optional(),
  capacity: z.number().int().min(1).max(50).optional(),
  isActive: z.boolean().optional(),
});

export const updateTableStatusSchema = z.object({
  status: z.nativeEnum(TableStatus),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>;
