import cron from 'node-cron';
import logger from '../config/logger';
import { OrderModel } from '../modules/orders/orders.model';
import { QueueEntryModel } from '../modules/queue/queue.model';
import { ReservationModel } from '../modules/reservations/reservations.model';
import { SubscriptionModel, SubscriptionStatus } from '../modules/subscriptions/subscriptions.model';
import { TableModel } from '../modules/tables/tables.model';
import { InventoryItemModel } from '../modules/inventory/inventory.model';
import { UserModel } from '../modules/users/users.model';
import { STAFF_ROLES } from '../constants/roles';
import { withLock } from '../utils/cronLock';
import { assertPlanLimit, assertFeatureAccess, recordSubscriptionUsage } from '../modules/subscriptions/subscriptionEnforcement.service';
import { OfferModel } from '../modules/offers/offers.model';

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
      ReservationModel.countDocuments({ restaurantId, createdAt: { $gte: today } }),
      OfferModel.countDocuments({ restaurantId, active: true }),
      InventoryItemModel.countDocuments({ restaurantId, active: { $ne: false } }),
      UserModel.countDocuments({ restaurantId, role: { $in: STAFF_ROLES } }),
    ]);

    await Promise.all([
      recordSubscriptionUsage(restaurantId, 'activeTables', activeTables),
      recordSubscriptionUsage(restaurantId, 'dailyOrderCount', dailyOrderCount),
      recordSubscriptionUsage(restaurantId, 'monthlyOrderCount', monthlyOrderCount),
      recordSubscriptionUsage(restaurantId, 'usageCount', totalOrders),
      recordSubscriptionUsage(restaurantId, 'queueUsage', queueUsage),
      recordSubscriptionUsage(restaurantId, 'reservationActivity', reservationActivity),
      recordSubscriptionUsage(restaurantId, 'discountUsage', discountUsage),
      recordSubscriptionUsage(restaurantId, 'inventoryCount', inventoryCount),
      recordSubscriptionUsage(restaurantId, 'staffCount', staffCount),
    ]);
    for (const [field, used, label] of [
      ['tableLimit', activeTables, 'tables'], ['dailyOrderLimit', dailyOrderCount, 'daily orders'],
      ['monthlyOrderLimit', monthlyOrderCount, 'monthly orders'], ['queueLimit', queueUsage, 'queue entries'],
      ['reservationLimit', reservationActivity, 'daily reservations'], ['inventoryLimit', inventoryCount, 'inventory items'],
      ['staffLimit', staffCount, 'staff members'],
    ] as const) {
      try { await assertPlanLimit(restaurantId, field, used, label); } catch { /* threshold alerts/block events are emitted by enforcement */ }
    }
    try { await assertFeatureAccess(restaurantId, 'advancedAnalytics', 'Advanced Analytics'); } catch { /* blocked feature is audited at request time */ }
  }

  return { processed: subscriptions.length };
}

export function startSubscriptionUsageAggregationJob() {
  // TODO: Migrate to BullMQ for robust queueing
  // Runs every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    logger.info('Starting subscription usage aggregation job...');
    try {
      await withLock('subscription-usage-aggregation', 15 * 60, async () => {
        await aggregateSubscriptionUsage();
      });
      logger.info('Finished subscription usage aggregation job.');
    } catch (error) {
      logger.error('Error during subscription usage aggregation job:', error);
    }
  });
}
