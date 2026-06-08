import { z } from 'zod';

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');
const isoDateTimeSchema = z.string().datetime({ message: 'Datetime must be a valid ISO 8601 string' });
const analyticsDateSchema = z.union([dateOnlySchema, isoDateTimeSchema]);

export const analyticsQuerySchema = z.object({
  from: analyticsDateSchema.optional(),
  to: analyticsDateSchema.optional(),
  groupBy: z.enum(['day', 'month']).optional(),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
