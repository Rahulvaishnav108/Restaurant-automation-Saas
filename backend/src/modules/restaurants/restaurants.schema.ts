import { z } from 'zod';

export const restaurantSettingsSchema = z.object({
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must be a 3-letter ISO code')
    .transform((value) => value.toUpperCase()),
  taxRate: z.coerce.number().min(0).max(1),
  serviceChargeEnabled: z.boolean(),
  sessionDurationMinutes: z.coerce.number().int().min(15).max(1440),
});

export const updateRestaurantSettingsBodySchema = restaurantSettingsSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field is required',
  },
);

export type UpdateRestaurantSettingsInput = z.infer<typeof updateRestaurantSettingsBodySchema>;
