import request from 'supertest';
import { signAccessToken } from '../../services/jwt.service';
import { UserRole } from '../../constants/roles';
import { ErrorCode } from '../../constants/errors';
import app from '../../app';
import { RestaurantModel } from '../../modules/restaurants/restaurants.model';

function createAdminToken(restaurantId: string): string {
  return signAccessToken({
    _id: 'admin-user-id',
    email: 'admin@example.com',
    role: UserRole.RESTAURANT_ADMIN,
    restaurantId,
  });
}

async function seedRestaurant() {
  return RestaurantModel.create({
    slug: 'amber-table',
    name: 'Amber Table',
    plan: 'PRO',
    cuisine: 'Indian',
    city: 'Delhi',
  });
}

describe('Admin Schema Integration Tests', () => {
  it('rejects an empty restaurant settings update body', async () => {
    const restaurant = await seedRestaurant();
    const token = createAdminToken(restaurant.id);

    const response = await request(app)
      .patch('/api/v1/admin/restaurant/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(response.body.error.fields.unknown).toContain('At least one field is required');
  });

  it('rejects invalid restaurant settings field values', async () => {
    const restaurant = await seedRestaurant();
    const token = createAdminToken(restaurant.id);

    const response = await request(app)
      .patch('/api/v1/admin/restaurant/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currency: 'rupees',
        taxRate: 1.2,
        serviceChargeEnabled: true,
        sessionDurationMinutes: 10,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(response.body.error.fields.currency).toContain('Currency must be a 3-letter ISO code');
    expect(response.body.error.fields.taxRate).toContain('Number must be less than or equal to 1');
    expect(response.body.error.fields.sessionDurationMinutes).toContain(
      'Number must be greater than or equal to 15',
    );
  });

  it('accepts a valid restaurant settings patch and persists the update', async () => {
    const restaurant = await seedRestaurant();
    const token = createAdminToken(restaurant.id);

    const response = await request(app)
      .patch('/api/v1/admin/restaurant/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currency: 'usd',
        taxRate: 0.12,
        serviceChargeEnabled: false,
        sessionDurationMinutes: 60,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.settings).toEqual({
      currency: 'USD',
      taxRate: 0.12,
      serviceChargeEnabled: false,
      sessionDurationMinutes: 60,
    });

    const persistedRestaurant = await RestaurantModel.findById(restaurant.id).lean();

    expect(persistedRestaurant?.settings).toMatchObject({
      currency: 'USD',
      taxRate: 0.12,
      serviceChargeEnabled: false,
      sessionDurationMinutes: 60,
    });
  });
});
