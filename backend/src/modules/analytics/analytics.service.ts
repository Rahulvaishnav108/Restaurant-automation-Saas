import mongoose from 'mongoose';
import { BillingService } from '../billing/billing.service';
import { BillingModel } from '../billing/billing.model';
import { BillStatus } from '../billing/billing.schema';
import { CustomerProfileModel } from './customerProfile.model';
import { OrderModel } from '../orders/orders.model';
import { TableModel } from '../tables/tables.model';
import { UserModel } from '../users/users.model';
import { UserRole } from '../../constants/roles';
import type { AnalyticsQueryInput } from './analytics.schema';

type AnalyticsDateRange = Pick<AnalyticsQueryInput, 'from' | 'to'>;
type RevenueAnalyticsFilters = AnalyticsDateRange & Pick<AnalyticsQueryInput, 'groupBy'>;

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toRangeDate(value: string, edge: 'start' | 'end'): Date {
  if (isDateOnly(value)) {
    const suffix = edge === 'start' ? 'T00:00:00.000Z' : 'T23:59:59.999Z';
    return new Date(`${value}${suffix}`);
  }

  return new Date(value);
}

function buildDateRangeMatch(field: string, filters: AnalyticsDateRange) {
  const range: Record<string, Date> = {};

  if (filters.from) {
    range.$gte = toRangeDate(filters.from, 'start');
  }

  if (filters.to) {
    range.$lte = toRangeDate(filters.to, 'end');
  }

  return Object.keys(range).length > 0 ? { [field]: range } : {};
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export class AnalyticsService {
  static async getAdminOverview(restaurantId: string) {
    const [revenue, tax, discounts, paymentReport] = await Promise.all([
      BillingService.getRevenueReport(restaurantId),
      BillingService.getTaxReport(restaurantId),
      BillingService.getDiscountReport(restaurantId),
      BillingService.getPaymentReport(restaurantId),
    ]);

    const repeatCustomersCount = await CustomerProfileModel.countDocuments({
      restaurantsVisited: new mongoose.Types.ObjectId(restaurantId),
      totalVisits: { $gt: 1 },
    });

    const totalCustomers = await CustomerProfileModel.countDocuments({
      restaurantsVisited: new mongoose.Types.ObjectId(restaurantId),
    });

    return {
      revenue: revenue.totalRevenue || 0,
      tax: tax.totalTax || 0,
      discounts: discounts.totalDiscount || 0,
      paymentReport: paymentReport.map((p: any) => ({
        paymentMethod: p._id,
        count: p.count,
        totalAmount: p.totalAmount,
      })),
      metrics: {
        repeatCustomersCount,
        totalCustomers,
      },
    };
  }

  static async getRevenueAnalytics(restaurantId: string, filters: RevenueAnalyticsFilters) {
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);
    const groupBy = filters.groupBy ?? 'day';
    const groupFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
    const paidAtMatch = buildDateRangeMatch('paidAt', filters);

    const matchStage = {
      restaurantId: restaurantObjectId,
      status: BillStatus.PAID,
      paidAt: { $ne: null },
      ...paidAtMatch,
    };

    const [summaryRows, revenueRows] = await Promise.all([
      BillingModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$finalAmount' },
            totalTax: { $sum: '$taxAmount' },
            totalDiscount: { $sum: '$discountAmount' },
            billCount: { $sum: 1 },
          },
        },
      ]),
      BillingModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: '$paidAt',
              },
            },
            totalRevenue: { $sum: '$finalAmount' },
            totalTax: { $sum: '$taxAmount' },
            totalDiscount: { $sum: '$discountAmount' },
            billCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const summary = summaryRows[0] ?? {
      totalRevenue: 0,
      totalTax: 0,
      totalDiscount: 0,
      billCount: 0,
    };

    return {
      summary: {
        totalRevenue: summary.totalRevenue ?? 0,
        totalTax: summary.totalTax ?? 0,
        totalDiscount: summary.totalDiscount ?? 0,
        billCount: summary.billCount ?? 0,
        averageBillValue:
          summary.billCount > 0 ? roundToTwoDecimals((summary.totalRevenue ?? 0) / summary.billCount) : 0,
      },
      revenue: revenueRows.map((row) => ({
        period: row._id,
        totalRevenue: row.totalRevenue ?? 0,
        totalTax: row.totalTax ?? 0,
        totalDiscount: row.totalDiscount ?? 0,
        billCount: row.billCount ?? 0,
      })),
      filters: {
        from: filters.from ?? null,
        to: filters.to ?? null,
        groupBy,
      },
    };
  }

  static async getPeakHours(restaurantId: string) {
    const result = await OrderModel.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return result.map(item => ({
      hour: item._id,
      orderCount: item.count,
      totalSales: item.totalSales,
    }));
  }

  static async getRepeatCustomers(restaurantId: string) {
    const customers = await CustomerProfileModel.find({
      restaurantsVisited: new mongoose.Types.ObjectId(restaurantId),
    })
      .sort({ totalVisits: -1 })
      .limit(10)
      .lean();

    return customers.map(c => ({
      id: c._id.toString(),
      name: c.name,
      mobile: c.mobile,
      totalVisits: c.totalVisits,
      totalSpent: c.totalSpent,
      lastVisit: c.lastVisitAt,
    }));
  }

  static async getKitchenPerformance(restaurantId: string) {
    const [kitchenUsers, handledOrders] = await Promise.all([
      UserModel.find({
        restaurantId,
        role: { $in: [UserRole.KITCHEN_STAFF, UserRole.RESTAURANT_ADMIN] },
      })
        .select('name role')
        .lean(),
      OrderModel.find({
        restaurantId,
        kitchenStaffId: { $ne: null },
      })
        .select('kitchenStaffId status acceptedAt readyAt rejectedAt totalAmount')
        .lean(),
    ]);

    const metrics = new Map<string, { orderCount: number; avgMinutes: number; totalMinutes: number; measuredCount: number }>();

    handledOrders.forEach(o => {
      if (!o.kitchenStaffId) return;
      const staffId = String(o.kitchenStaffId);
      const current = metrics.get(staffId) ?? { orderCount: 0, avgMinutes: 0, totalMinutes: 0, measuredCount: 0 };
      current.orderCount += 1;

      const finishTime = o.readyAt ?? o.rejectedAt ?? null;
      if (o.acceptedAt && finishTime) {
        const diff = Math.max(0, Math.round((new Date(finishTime).getTime() - new Date(o.acceptedAt).getTime()) / 60000));
        current.totalMinutes += diff;
        current.measuredCount += 1;
      }
      metrics.set(staffId, current);
    });

    return kitchenUsers.map(u => {
      const stats = metrics.get(String(u._id)) ?? { orderCount: 0, avgMinutes: 0, totalMinutes: 0, measuredCount: 0 };
      return {
        id: String(u._id),
        name: u.name,
        role: u.role,
        ordersHandled: stats.orderCount,
        avgPreparationTimeMinutes: stats.measuredCount > 0 ? Math.round(stats.totalMinutes / stats.measuredCount) : 0,
      };
    });
  }

  static async getTableUtilization(restaurantId: string) {
    const tables = await TableModel.find({ restaurantId }).lean();
    const utilization = tables.map(t => ({
      id: t._id.toString(),
      tableNumber: t.tableNumber,
      capacity: t.capacity,
      status: t.status,
      section: t.section || 'General',
      floor: t.floor || 1,
    }));
    return utilization;
  }

  static async getCustomerRetention(restaurantId: string, filters: AnalyticsDateRange) {
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);
    const baseMatch = { restaurantsVisited: restaurantObjectId };
    const activeMatch = {
      ...baseMatch,
      ...buildDateRangeMatch('lastVisitAt', filters),
    };

    const [totalCustomers, repeatCustomers, activeCustomers, topCustomers] = await Promise.all([
      CustomerProfileModel.countDocuments(baseMatch),
      CustomerProfileModel.countDocuments({ ...baseMatch, totalVisits: { $gt: 1 } }),
      CustomerProfileModel.countDocuments(activeMatch),
      CustomerProfileModel.find(activeMatch)
        .sort({ totalVisits: -1, lastVisitAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return {
      summary: {
        totalCustomers,
        repeatCustomers,
        activeCustomers,
        repeatRatePercent: totalCustomers > 0 ? roundToTwoDecimals((repeatCustomers / totalCustomers) * 100) : 0,
      },
      customers: topCustomers.map((customer) => ({
        id: customer._id.toString(),
        name: customer.name,
        mobile: customer.mobile,
        totalVisits: customer.totalVisits,
        totalSpent: customer.totalSpent,
        lastVisitAt: customer.lastVisitAt,
      })),
      filters: {
        from: filters.from ?? null,
        to: filters.to ?? null,
      },
    };
  }
}
