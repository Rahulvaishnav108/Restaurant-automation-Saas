import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
