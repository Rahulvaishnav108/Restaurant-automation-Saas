import mongoose from 'mongoose';
import { z } from 'zod';
import { PaymentStatus } from '../../constants/statuses';
import { PaymentMethod } from '../billing/billing.schema';

const objectIdSchema = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: 'Invalid id',
});

export const paymentIdParamsSchema = z.object({
  paymentId: z.string().min(1, 'Payment id is required'),
});

export const createPaymentBodySchema = z
  .object({
    method: z.nativeEnum(PaymentMethod).optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  })
  .refine((value) => value.method || value.paymentMethod, {
    message: 'Payment method is required',
    path: ['method'],
  });

export const verifyPaymentBodySchema = z.object({
  paymentId: z.string().min(1, 'Payment id is required'),
  simulateStatus: z.enum(['PENDING', 'PAID', 'COMPLETED', 'FAILED', 'EXPIRED']).optional(),
});

export const listPaymentsQuerySchema = z.object({
  status: z.nativeEnum(PaymentStatus).optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
  sessionId: objectIdSchema.optional(),
  orderId: objectIdSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreatePaymentInput = z.infer<typeof createPaymentBodySchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentBodySchema>;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;
