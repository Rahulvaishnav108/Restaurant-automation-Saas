// src/modules/restaurants/restaurants.service.ts
// Business logic for the restaurants module.
// Controllers stay thin — all DB interaction lives here.

import { RestaurantModel } from './restaurants.model';
import { TableModel } from '../tables/tables.model';
import { TableSessionModel } from '../tableSessions/tableSessions.model';
import { SessionStatus, TableStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import type { UpdateRestaurantSettingsInput } from './restaurants.schema';
import { OrderModel } from '../orders/orders.model';
import { BillingModel } from '../billing/billing.model';
import { ReservationModel } from '../reservations/reservations.model';
import { BillStatus } from '../billing/billing.schema';
import { OrderStatus } from '../../constants/statuses';
import mongoose from 'mongoose';

// ── Get public restaurant by slug ─────────────────────────────────────
export async function getRestaurantBySlug(slug: string) {
  const restaurant = await RestaurantModel.findOne({ slug }).lean();

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404, ErrorCode.NOT_FOUND);
  }

  return restaurant;
}

// ── Get restaurant by ID ──────────────────────────────────────────────
export async function getRestaurantById(restaurantId: string) {
  const restaurant = await RestaurantModel.findById(restaurantId).lean();

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404, ErrorCode.NOT_FOUND);
  }

  return restaurant;
}

// ── Get restaurant overview with live metrics ─────────────────────────
export async function getRestaurantOverview(restaurantId: string) {
  const restaurant = await getRestaurantById(restaurantId);

  const [totalTables, activeSessions, occupiedTables] = await Promise.all([
    TableModel.countDocuments({ restaurantId }),
    TableSessionModel.countDocuments({ restaurantId, status: SessionStatus.ACTIVE }),
    TableModel.countDocuments({ restaurantId, status: { $in: [TableStatus.OCCUPIED, TableStatus.ORDERING, TableStatus.BILL_PENDING, TableStatus.PAYMENT_PENDING, TableStatus.PAID] } }),
  ]);

  return {
    restaurant,
    metrics: {
      totalTables,
      activeSessions,
      occupiedTables,
    },
  };
}

export async function getRestaurantDashboard(restaurantId: string) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(startToday);
  weekStart.setDate(weekStart.getDate() - 6);
  const [
    todayRevenueRows,
    previousRevenueRows,
    todayOrders,
    activeOrders,
    totalCustomers,
    dailyRevenueRows,
    recentOrders,
    topItems,
    tableCounts,
    upcomingReservations,
  ] = await Promise.all([
    BillingModel.aggregate([{ $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: BillStatus.PAID, paidAt: { $gte: startToday } } }, { $group: { _id: null, total: { $sum: '$finalAmount' } } }]),
    BillingModel.aggregate([{ $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: BillStatus.PAID, paidAt: { $gte: new Date(startToday.getTime() - 86400000), $lt: startToday } } }, { $group: { _id: null, total: { $sum: '$finalAmount' } } }]),
    OrderModel.countDocuments({ restaurantId, createdAt: { $gte: startToday } }),
    OrderModel.countDocuments({ restaurantId, status: { $nin: [OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.REJECTED] } }),
    OrderModel.distinct('customerId', { restaurantId, customerId: { $ne: null } }).then((ids) => ids.length),
    BillingModel.aggregate([{ $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: BillStatus.PAID, paidAt: { $gte: weekStart } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } }, total: { $sum: '$finalAmount' } } }]),
    OrderModel.find({ restaurantId }).sort({ createdAt: -1 }).limit(6).populate('tableId', 'tableNumber').lean(),
    OrderModel.aggregate([{ $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), createdAt: { $gte: weekStart } } }, { $unwind: '$items' }, { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.totalPrice' } } }, { $sort: { quantity: -1 } }, { $limit: 5 }]),
    TableModel.aggregate([{ $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), isActive: true } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    ReservationModel.find({ restaurantId, date: { $gte: startToday.toISOString().slice(0, 10) }, status: { $nin: ['CANCELLED', 'CANCELED'] } }).sort({ date: 1, slot: 1 }).limit(5).lean(),
  ]);

  const currentRevenue = todayRevenueRows[0]?.total ?? 0;
  const previousRevenue = previousRevenueRows[0]?.total ?? 0;
  const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : null;
  const revenueByDay = new Map(dailyRevenueRows.map((row: any) => [row._id, row.total]));
  const revenue = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    const key = day.toISOString().slice(0, 10);
    return { date: key, label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(day), total: revenueByDay.get(key) ?? 0 };
  });

  return {
    metrics: { revenue: currentRevenue, revenueChange, orders: todayOrders, activeOrders, customers: totalCustomers },
    revenue,
    recentOrders: recentOrders.map((order: any) => ({ id: order.orderNumber, table: order.tableId?.tableNumber ?? 'Takeaway', items: order.items.map((item: any) => item.name).slice(0, 3).join(', '), total: order.finalAmount ?? order.totalAmount, status: order.status, createdAt: order.createdAt })),
    topItems: topItems.map((item: any) => ({ name: item._id, quantity: item.quantity, revenue: item.revenue })),
    tables: tableCounts.reduce((result: Record<string, number>, row: any) => { result[row._id] = row.count; return result; }, {}),
    upcomingReservations: upcomingReservations.map((reservation: any) => ({ id: reservation._id, name: reservation.customerName, date: reservation.date, slot: reservation.slot, guests: reservation.guests, status: reservation.status })),
    generatedAt: now,
  };
}

// ── Get restaurant settings ───────────────────────────────────────────
export async function getRestaurantSettings(restaurantId: string) {
  const restaurant = await getRestaurantById(restaurantId);

  return {
    restaurantId: restaurant._id.toString(),
    settings: restaurant.settings,
  };
}

// ── Update restaurant settings ────────────────────────────────────────
export async function updateRestaurantSettings(
  restaurantId: string,
  input: UpdateRestaurantSettingsInput,
) {
  // findById without .lean() so we can call .save()
  const restaurant = await RestaurantModel.findById(restaurantId);

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404, ErrorCode.NOT_FOUND);
  }

  // Shallow merge — only fields present in input are updated
  restaurant.settings = {
    ...restaurant.settings,
    ...input,
    ...(input.emailPreferences && {
      emailPreferences: {
        dailySalesReports: input.emailPreferences.dailySalesReports ?? restaurant.settings.emailPreferences.dailySalesReports,
        inventoryAlerts: input.emailPreferences.inventoryAlerts ?? restaurant.settings.emailPreferences.inventoryAlerts,
        staffNotifications: input.emailPreferences.staffNotifications ?? restaurant.settings.emailPreferences.staffNotifications,
      },
    }),
    ...(input.branding && {
      branding: {
        ...restaurant.settings.branding,
        ...input.branding,
      },
    }),
    ...(input.timezone && { timezone: input.timezone }),
    ...(input.dateFormat && { dateFormat: input.dateFormat }),
    ...(input.timeFormat && { timeFormat: input.timeFormat }),
  } as typeof restaurant.settings;

  await restaurant.save();

  return {
    restaurantId: restaurant._id.toString(),
    settings: restaurant.settings,
  };
}
