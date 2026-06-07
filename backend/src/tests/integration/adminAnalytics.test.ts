import request from 'supertest';
import app from '../../app';
import { signAccessToken } from '../../services/jwt.service';
import { UserRole } from '../../constants/roles';
import { RestaurantModel } from '../../modules/restaurants/restaurants.model';
import { TableModel } from '../../modules/tables/tables.model';
import { TableStatus } from '../../constants/statuses';
import { BillingModel } from '../../modules/billing/billing.model';
import {
  BillStatus,
  PaymentMethod,
  PaymentStatus,
} from '../../modules/billing/billing.schema';
import { CustomerProfileModel } from '../../modules/analytics/customerProfile.model';

function createAdminToken(restaurantId: string): string {
  return signAccessToken({
    _id: '507f1f77bcf86cd799439099',
    email: 'analytics.admin@example.com',
    role: UserRole.RESTAURANT_ADMIN,
    restaurantId,
  });
}

async function seedAnalyticsContext() {
  const restaurant = await RestaurantModel.create({
    slug: 'analytics-hub',
    name: 'Analytics Hub',
    plan: 'PRO',
    cuisine: 'Fusion',
    city: 'Delhi',
  });

  await TableModel.create([
    {
      restaurantId: restaurant._id,
      tableNumber: 'A1',
      capacity: 4,
      floor: 1,
      section: 'Main',
      status: TableStatus.AVAILABLE,
      qrCode: 'analytics-qr-a1',
    },
    {
      restaurantId: restaurant._id,
      tableNumber: 'B2',
      capacity: 6,
      floor: 2,
      section: 'VIP',
      status: TableStatus.OCCUPIED,
      qrCode: 'analytics-qr-b2',
    },
  ]);

  await BillingModel.create([
    {
      restaurantId: restaurant._id,
      orderIds: ['507f1f77bcf86cd799439021'],
      subtotal: 90,
      taxAmount: 10,
      serviceCharge: 0,
      discountAmount: 5,
      finalAmount: 95,
      paymentMethod: PaymentMethod.UPI,
      paymentStatus: PaymentStatus.PAID,
      status: BillStatus.PAID,
      paidAt: new Date('2026-01-05T12:00:00.000Z'),
    },
    {
      restaurantId: restaurant._id,
      orderIds: ['507f1f77bcf86cd799439022'],
      subtotal: 180,
      taxAmount: 20,
      serviceCharge: 0,
      discountAmount: 0,
      finalAmount: 200,
      paymentMethod: PaymentMethod.CARD,
      paymentStatus: PaymentStatus.PAID,
      status: BillStatus.PAID,
      paidAt: new Date('2026-01-12T14:30:00.000Z'),
    },
    {
      restaurantId: restaurant._id,
      orderIds: ['507f1f77bcf86cd799439023'],
      subtotal: 140,
      taxAmount: 10,
      serviceCharge: 0,
      discountAmount: 0,
      finalAmount: 150,
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PAID,
      status: BillStatus.PAID,
      paidAt: new Date('2026-02-03T09:15:00.000Z'),
    },
  ]);

  await CustomerProfileModel.create([
    {
      mobile: '9999900001',
      name: 'Aarav',
      totalVisits: 5,
      totalSpent: 4200,
      firstVisitAt: new Date('2025-12-20T10:00:00.000Z'),
      lastVisitAt: new Date('2026-01-18T19:00:00.000Z'),
      restaurantsVisited: [restaurant._id],
    },
    {
      mobile: '9999900002',
      name: 'Mira',
      totalVisits: 1,
      totalSpent: 850,
      firstVisitAt: new Date('2026-01-10T09:00:00.000Z'),
      lastVisitAt: new Date('2026-01-10T09:00:00.000Z'),
      restaurantsVisited: [restaurant._id],
    },
    {
      mobile: '9999900003',
      name: 'Kabir',
      totalVisits: 3,
      totalSpent: 2750,
      firstVisitAt: new Date('2025-11-02T18:00:00.000Z'),
      lastVisitAt: new Date('2026-02-02T21:15:00.000Z'),
      restaurantsVisited: [restaurant._id],
    },
  ]);

  return {
    token: createAdminToken(restaurant.id),
  };
}

describe('Admin analytics routes', () => {
  it('returns PDF-aligned revenue analytics with date-only filters and day grouping', async () => {
    const { token } = await seedAnalyticsContext();

    const response = await request(app)
      .get('/api/v1/admin/analytics/revenue?from=2026-01-01&to=2026-01-31&groupBy=day')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.summary).toMatchObject({
      totalRevenue: 295,
      totalTax: 30,
      totalDiscount: 5,
      billCount: 2,
      averageBillValue: 147.5,
    });
    expect(response.body.data.filters).toEqual({
      from: '2026-01-01',
      to: '2026-01-31',
      groupBy: 'day',
    });
    expect(response.body.data.revenue).toEqual([
      {
        period: '2026-01-05',
        totalRevenue: 95,
        totalTax: 10,
        totalDiscount: 5,
        billCount: 1,
      },
      {
        period: '2026-01-12',
        totalRevenue: 200,
        totalTax: 20,
        totalDiscount: 0,
        billCount: 1,
      },
    ]);
  });

  it('returns PDF-aligned table utilization analytics', async () => {
    const { token } = await seedAnalyticsContext();

    const response = await request(app)
      .get('/api/v1/admin/analytics/table-utilization')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.tableUtilization).toHaveLength(2);
    expect(response.body.data.tableUtilization).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tableNumber: 'A1',
          status: TableStatus.AVAILABLE,
          section: 'Main',
        }),
        expect.objectContaining({
          tableNumber: 'B2',
          status: TableStatus.OCCUPIED,
          section: 'VIP',
        }),
      ]),
    );
  });

  it('returns PDF-aligned customer retention analytics', async () => {
    const { token } = await seedAnalyticsContext();

    const response = await request(app)
      .get('/api/v1/admin/analytics/customer-retention?from=2026-01-01&to=2026-01-31')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.customerRetention.summary).toEqual({
      totalCustomers: 3,
      repeatCustomers: 2,
      activeCustomers: 2,
      repeatRatePercent: 66.67,
    });
    expect(response.body.data.customerRetention.filters).toEqual({
      from: '2026-01-01',
      to: '2026-01-31',
    });
    expect(response.body.data.customerRetention.customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Aarav',
          totalVisits: 5,
        }),
        expect.objectContaining({
          name: 'Mira',
          totalVisits: 1,
        }),
      ]),
    );
  });
});
