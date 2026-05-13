import { z } from 'zod';

export const validateTableSessionRequestSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const createTableSessionRequestSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1),
    customerName: z.string().trim().min(2),
    partySize: z.coerce.number().int().positive().max(20),
  }),
  params: z.object({}),
  query: z.object({}),
});
