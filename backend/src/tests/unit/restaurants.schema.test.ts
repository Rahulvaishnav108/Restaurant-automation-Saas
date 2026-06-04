import {
  restaurantSettingsSchema,
  updateRestaurantSettingsBodySchema,
} from '../../modules/restaurants/restaurants.schema';

describe('Restaurant Settings Schema', () => {
  it('parses a full settings payload and normalizes currency', () => {
    const result = restaurantSettingsSchema.parse({
      currency: 'inr',
      taxRate: '0.18',
      serviceChargeEnabled: true,
      sessionDurationMinutes: '120',
    });

    expect(result).toEqual({
      currency: 'INR',
      taxRate: 0.18,
      serviceChargeEnabled: true,
      sessionDurationMinutes: 120,
    });
  });

  it('allows partial updates for restaurant settings', () => {
    const result = updateRestaurantSettingsBodySchema.parse({
      currency: 'usd',
      sessionDurationMinutes: '45',
    });

    expect(result).toEqual({
      currency: 'USD',
      sessionDurationMinutes: 45,
    });
  });

  it('rejects an empty update payload', () => {
    const result = updateRestaurantSettingsBodySchema.safeParse({});

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues[0]?.message).toBe('At least one field is required');
  });

  it.each([
    [{ currency: 'rupee' }, 'Currency must be a 3-letter ISO code'],
    [{ taxRate: -0.01 }, 'Number must be greater than or equal to 0'],
    [{ taxRate: 1.25 }, 'Number must be less than or equal to 1'],
    [{ sessionDurationMinutes: 10 }, 'Number must be greater than or equal to 15'],
  ])('rejects invalid payload %j', (payload, expectedMessage) => {
    const result = updateRestaurantSettingsBodySchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.issues[0]?.message).toBe(expectedMessage);
  });
});
