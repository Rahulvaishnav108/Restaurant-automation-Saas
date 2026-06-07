import { z } from 'zod';

export const createLoyaltyRuleBodySchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    pointsPerVisit: z.coerce.number().int().min(1).max(10_000),
    silverThreshold: z.coerce.number().int().min(1).max(1_000_000),
    goldThreshold: z.coerce.number().int().min(1).max(1_000_000),
    notes: z.string().trim().max(500).optional(),
    active: z.boolean().optional(),
  })
  .refine((value) => value.goldThreshold > value.silverThreshold, {
    message: 'Gold threshold must be greater than silver threshold',
    path: ['goldThreshold'],
  });

export type CreateLoyaltyRuleInput = z.infer<typeof createLoyaltyRuleBodySchema>;
