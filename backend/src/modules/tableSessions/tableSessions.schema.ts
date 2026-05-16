// src/modules/tableSessions/tableSessions.schema.ts
// Zod validation schemas for table session endpoints

import { z } from 'zod';

export const startSessionSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  tableId: z.string().min(1, 'Table ID is required'),
  customerName: z.string().min(1, 'Customer name is required').max(100),
  mobile: z.string().min(10, 'Valid mobile number is required').max(15),
  reservationId: z.string().optional(),
});

export const recoverSessionSchema = z.object({
  sessionToken: z.string().min(1, 'Session token is required'),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type RecoverSessionInput = z.infer<typeof recoverSessionSchema>;
