import request from 'supertest';
import { signAccessToken } from '../../services/jwt.service';
import { UserRole } from '../../constants/roles';
import app from '../../app';
import { RestaurantModel } from '../../modules/restaurants/restaurants.model';
import { InventoryItemModel } from '../../modules/inventory/inventory.model';

function createAdminToken(restaurantId: string): string {
  return signAccessToken({
    _id: '507f1f77bcf86cd799439011',
    email: 'admin@example.com',
    role: UserRole.RESTAURANT_ADMIN,
    restaurantId,
  });
}

function createKitchenToken(restaurantId: string): string {
  return signAccessToken({
    _id: '507f1f77bcf86cd799439013',
    email: 'kitchen@example.com',
    role: UserRole.KITCHEN_STAFF,
    restaurantId,
  });
}

function createWaitStaffToken(restaurantId: string): string {
  return signAccessToken({
    _id: '507f1f77bcf86cd799439014',
    email: 'waitstaff@example.com',
    role: UserRole.SERVICE_STAFF,
    restaurantId,
  });
}

async function seedRestaurant() {
  return RestaurantModel.create({
    slug: 'inventory-test-rest',
    name: 'Inventory Test Rest',
    plan: 'PRO',
    cuisine: 'Mixed',
    city: 'New York',
  });
}

describe('Inventory Routes Integration', () => {
  let restaurant: any;
  let adminToken: string;
  let kitchenToken: string;
  let waitStaffToken: string;

  beforeEach(async () => {
    restaurant = await seedRestaurant();
    adminToken = createAdminToken(restaurant.id);
    kitchenToken = createKitchenToken(restaurant.id);
    waitStaffToken = createWaitStaffToken(restaurant.id);
  });

  describe('Admin Inventory Endpoints', () => {
    it('creates an inventory item (Admin)', async () => {
      const response = await request(app)
        .post('/api/v1/admin/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Onions',
          stock: 50,
          unit: 'kg',
          threshold: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.item.name).toBe('Onions');
    });

    it('rejects unauthorized role (Wait Staff) from creating item', async () => {
      const response = await request(app)
        .post('/api/v1/admin/inventory')
        .set('Authorization', `Bearer ${waitStaffToken}`)
        .send({
          name: 'Garlic',
          stock: 10,
          unit: 'kg',
          threshold: 2,
        });

      expect(response.status).toBe(403);
    });

    it('fetches inventory items (Admin)', async () => {
      await InventoryItemModel.create({ restaurantId: restaurant.id, name: 'Onions', stock: 50, threshold: 10, unit: 'kg' });

      const response = await request(app)
        .get('/api/v1/admin/inventory')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items.length).toBeGreaterThan(0);
    });

    it('fetches inventory stats (Admin)', async () => {
      const response = await request(app)
        .get('/api/v1/admin/inventory/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.stats).toBeDefined();
    });
  });

  describe('Kitchen Inventory Endpoints (Phase 8)', () => {
    it('allows Kitchen Staff to access inventory', async () => {
      await InventoryItemModel.create({ restaurantId: restaurant.id, name: 'Onions', stock: 50, threshold: 10, unit: 'kg' });

      const response = await request(app)
        .get('/api/v1/kitchen/inventory')
        .set('Authorization', `Bearer ${kitchenToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toBeDefined();
    });

    it('allows Kitchen Staff to access inventory alerts', async () => {
      await InventoryItemModel.create({ restaurantId: restaurant.id, name: 'LowOnions', stock: 5, threshold: 10, unit: 'kg' });

      const response = await request(app)
        .get('/api/v1/kitchen/inventory/alerts')
        .set('Authorization', `Bearer ${kitchenToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.alerts).toBeDefined();
    });

    it('allows Restaurant Admin to access kitchen inventory endpoints', async () => {
      const response = await request(app)
        .get('/api/v1/kitchen/inventory')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('denies Wait Staff from accessing kitchen inventory endpoints', async () => {
      const response = await request(app)
        .get('/api/v1/kitchen/inventory')
        .set('Authorization', `Bearer ${waitStaffToken}`);

      expect(response.status).toBe(403);
    });
  });
});
