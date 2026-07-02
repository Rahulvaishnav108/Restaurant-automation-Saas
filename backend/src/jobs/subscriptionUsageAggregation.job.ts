import cron from 'node-cron';
import logger from '../config/logger';
import { OrderModel } from '../modules/orders/orders.model';
import { OfferModel } from '../modules/offers/offers.model';
import { QueueEntryModel } from '../modules/queue/queue.model';
import { ReservationModel } from '../modules/reservations/reservations.model';
import { SubscriptionModel, SubscriptionStatus } from '../modules/subscriptions/subscriptions.model';
import { TableModel } from '../modules/tables/tables.model';
import { InventoryItemModel } from '../modules/inventory/inventory.model';
import { UserModel } from '../modules/users/users.model';
import { STAFF_ROLES } from '../constants/roles';

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function aggregateSubscriptionUsage() {
  const subscriptions = await SubscriptionModel.find({ status: SubscriptionStatus.ACTIVE });
  const now = new Date();
  const today = startOfDay(now);
  const month = startOfMonth(now);

  for (const subscription of subscriptions) {
    const restaurantId = subscription.restaurantId;
    const [
      totalOrders,
      dailyOrderCount,
      monthlyOrderCount,
      activeTables,
      queueUsage,
      reservationActivity,
      discountUsage,
      inventoryCount,
      staffCount,
    ] = await Promise.all([
      OrderModel.countDocuments({ restaurantId }),
      OrderModel.countDocuments({ restaurantId, createdAt: { $gte: today } }),
      OrderModel.countDocuments({ restaurantId, createdAt: { $gte: month } }),
      TableModel.countDocuments({ restaurantId, isActive: true }),
      QueueEntryModel.countDocuments({ restaurantId }),
      ReservationModel.countDocuments({ restaurantId }),
      OfferModel.countDocuments({ restaurantId }),
      InventoryItemModel.countDocuments({ restaurantId, active: { $ne: false } }),
      UserModel.countDocuments({ restaurantId, role: { $in: STAFF_ROLES } }),
    ]);

    subscription.activeTables = activeTables;
    subscription.dailyOrderCount = dailyOrderCount;
    subscription.monthlyOrderCount = monthlyOrderCount;
    subscription.usageCount = totalOrders;
    subscription.usage = {
      ...(subscription.usage ?? {}),
      totalOrders,
      dailyOrderCount,
      monthlyOrderCount,
      activeTables,
      queueUsage,
      reservationActivity,
      discountUsage,
      customerTraffic: totalOrders,
      analyticsUsage: subscription.usage?.analyticsUsage ?? 0,
      inventoryCount,
      staffCount,
    };

    await subscription.save();
  }

  return { processed: subscriptions.length };
}

export function startSubscriptionUsageAggregationJob(): void {
  cron.schedule('*/30 * * * *', async () => {
    try {
      const result = await aggregateSubscriptionUsage();
      logger.info('Subscription usage aggregation completed', result);
    } catch (error) {
      logger.error('Subscription usage aggregation failed', { error });
    }
  });
}
