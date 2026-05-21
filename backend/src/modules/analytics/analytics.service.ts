import mongoose from 'mongoose';
import { BillingService } from '../billing/billing.service';
import { CustomerProfileModel } from './customerProfile.model';
import { OrderModel } from '../orders/orders.model';
import { TableModel } from '../tables/tables.model';
import { UserModel } from '../users/users.model';
import { UserRole } from '../../constants/roles';

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
}
