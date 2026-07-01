import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  restaurantId: z.string().min(1),
  plan: z.string().min(1),
  seats: z.number().int().positive().optional(),
  currentPeriodEnd: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: 'Invalid date' }),
});

export const updateSubscriptionSchema = z.object({
  plan: z.string().optional(),
  seats: z.number().int().positive().optional(),
  status: z.enum(['active', 'cancelled', 'past_due', 'suspended']).optional(),
});

export const subscriptionIdParam = z.object({ id: z.string().min(1) });

export const lifecycleActionSchema = z.object({
  immediate: z.boolean().optional(),
});

export const renewSchema = z.object({
  days: z.coerce.number().int().positive().default(30),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
