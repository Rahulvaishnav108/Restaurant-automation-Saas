import cron from 'node-cron';
import logger from '../config/logger';
import { UserRole } from '../constants/roles';
import { RestaurantModel } from '../modules/restaurants/restaurants.model';
import { NotificationsService } from '../modules/notifications/notifications.service';
import { NotificationCategory, NotificationPriority } from '../modules/notifications/notifications.schema';
import {
  BillingCycle,
  SubscriptionEventType,
  SubscriptionPaymentProvider,
  SubscriptionStatus,
  SubscriptionModel,
} from '../modules/subscriptions/subscriptions.model';
import { appendSubscriptionHistory } from '../modules/subscriptions/subscriptions.history.service';
import { withLock } from '../utils/cronLock';
import { PlatformPlanModel } from '../modules/superAdmin/superAdmin.model';
import { createBillingOrder } from '../modules/subscriptions/subscriptions.service';
import { SubscriptionPaymentModel, SubscriptionPaymentStatus } from '../modules/subscriptions/subscriptions.model';

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function billingDays(cycle: BillingCycle) {
  return cycle === BillingCycle.YEARLY ? 365 : 30;
}

async function notify(restaurantId: any, title: string, message: string, type: string) {
  try {
    await NotificationsService.createNotification({
      restaurantId,
      recipientRole: UserRole.RESTAURANT_ADMIN,
      title,
      message,
      type,
      category: NotificationCategory.SYSTEM,
      priority: NotificationPriority.HIGH,
      expiresAt: addDays(new Date(), 7),
    });
  } catch {
    return null;
  }
}

async function log(subscription: any, type: SubscriptionEventType, metadata: Record<string, unknown>) {
  try {
    await appendSubscriptionHistory({
      subscriptionId: subscription._id,
      restaurantId: subscription.restaurantId,
      eventType: type,
      metadata,
    });
  } catch {
    return null;
  }
}

async function applyPendingDowngrade(subscription: any) {
  const pending = subscription.metadata?.pendingDowngrade;
  if (!pending?.plan || !pending?.appliesAt || new Date(pending.appliesAt) > new Date()) {
    return false;
  }

  const plan = await PlatformPlanModel.findOne({ name: pending.plan }).lean();
  if (!plan) {
    return false;
  }

  const previousPlan = subscription.plan;
  const session = await SubscriptionModel.startSession();
  try {
    await session.withTransaction(async () => {
      subscription.plan = plan.name;
      subscription.planId = plan._id;
      subscription.seats = pending.seats ?? subscription.seats;
      const metadata = { ...(subscription.metadata ?? {}) };
      delete metadata.pendingDowngrade;
      subscription.metadata = metadata;
      await subscription.save({ session });
      await RestaurantModel.updateOne({ _id: subscription.restaurantId }, { plan: plan.name }, { session });
      await appendSubscriptionHistory({
        subscriptionId: subscription._id, restaurantId: subscription.restaurantId,
        eventType: SubscriptionEventType.DOWNGRADED,
        metadata: { fromPlan: previousPlan, toPlan: plan.name, planId: plan._id, appliedAt: new Date() },
        session,
      });
    });
  } finally { await session.endSession(); }
  await notify(
    subscription.restaurantId,
    'Subscription downgraded',
    `Your subscription has been downgraded from ${previousPlan} to ${plan.name}.`,
    'SUBSCRIPTION_DOWNGRADED',
  );

  return true;
}

export async function processSubscriptionLifecycle() {
  const now = new Date();
  const subscriptions = await SubscriptionModel.find({
    status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED, SubscriptionStatus.PAST_DUE] },
  });

  let processed = 0;

  for (const subscription of subscriptions) {
    processed += 1;
    await applyPendingDowngrade(subscription);

    const msUntilExpiry = subscription.currentPeriodEnd.getTime() - now.getTime();
    const daysUntilExpiry = Math.ceil(msUntilExpiry / (24 * 60 * 60 * 1000));

    const reminderSent: number[] = Array.isArray(subscription.metadata?.renewalReminderDays)
      ? subscription.metadata.renewalReminderDays as number[]
      : [];
    if ([7, 3, 1].includes(daysUntilExpiry) && !reminderSent.includes(daysUntilExpiry)) {
      await notify(
        subscription.restaurantId,
        'Subscription renewal reminder',
        `Your ${subscription.plan} subscription renews in ${daysUntilExpiry} day(s).`,
        'SUBSCRIPTION_RENEWAL_REMINDER',
      );
      await log(subscription, SubscriptionEventType.RENEWAL_REMINDER, { daysUntilExpiry });
      subscription.metadata = { ...(subscription.metadata ?? {}), renewalReminderDays: [...reminderSent, daysUntilExpiry] };
      await subscription.save();
    }

    if (subscription.currentPeriodEnd > now) {
      continue;
    }

    if (subscription.metadata?.cancelAtPeriodEnd || subscription.metadata?.expireAtPeriodEnd || !subscription.autoRenew) {
      const expired = await SubscriptionModel.findOneAndUpdate(
        { _id: subscription._id, status: { $ne: SubscriptionStatus.EXPIRED }, currentPeriodEnd: { $lte: now } },
        { $set: { status: SubscriptionStatus.EXPIRED, expiredAt: now, autoRenew: false } },
        { new: true },
      );
      if (!expired) continue;
      await log(expired, SubscriptionEventType.EXPIRED, { reason: 'period_end' });
      await notify(
        expired.restaurantId,
        'Subscription expired',
        `Your ${subscription.plan} subscription has expired.`,
        'SUBSCRIPTION_EXPIRED',
      );
      continue;
    }

    if (subscription.paymentProvider === SubscriptionPaymentProvider.MOCK || subscription.paymentProvider === SubscriptionPaymentProvider.MANUAL) {
      const days = billingDays(subscription.billingCycle);
      const nextEnd = addDays(subscription.currentPeriodEnd, days);
      const renewed = await SubscriptionModel.findOneAndUpdate(
        { _id: subscription._id, status: subscription.status, currentPeriodEnd: subscription.currentPeriodEnd },
        { $set: { status: SubscriptionStatus.ACTIVE, currentPeriodStart: subscription.currentPeriodEnd, currentPeriodEnd: nextEnd, nextBillingDate: nextEnd, expiredAt: null, cancelledAt: null, isTrial: false, trialStartsAt: null, trialEndsAt: null } },
        { new: true },
      );
      if (renewed) {
        await log(renewed, SubscriptionEventType.RENEWED, { days, currentPeriodStart: renewed.currentPeriodStart, currentPeriodEnd: renewed.currentPeriodEnd });
        await notify(renewed.restaurantId, 'Subscription renewed', `Your ${renewed.plan} subscription has been renewed.`, 'SUBSCRIPTION_RENEWED');
      }
      continue;
    }

    const pendingPayment = await SubscriptionPaymentModel.findOne({
      subscriptionId: subscription._id,
      status: SubscriptionPaymentStatus.PENDING,
      createdAt: { $gte: addDays(now, -1) },
    }).lean();
    if (pendingPayment) {
      continue;
    }

    const billing = await createBillingOrder(subscription._id.toString(), {
      provider: subscription.paymentProvider,
      currency: 'INR',
    });
    const claimed = await SubscriptionModel.findOneAndUpdate(
      { _id: subscription._id, status: subscription.status, currentPeriodEnd: subscription.currentPeriodEnd },
      { $set: { status: SubscriptionStatus.PAST_DUE, nextBillingDate: addDays(now, 1) } },
      { new: true },
    );
    if (!claimed) {
      await SubscriptionPaymentModel.deleteOne({ _id: billing.payment._id, status: SubscriptionPaymentStatus.PENDING });
      continue;
    }
    await notify(
      subscription.restaurantId,
      'Subscription payment required',
      `Payment is required to renew your ${subscription.plan} subscription.`,
      'SUBSCRIPTION_PAYMENT_REQUIRED',
    );
  }

  return { processed };
}

export function startSubscriptionsLifecycleJob(): void {
  cron.schedule('0 * * * *', async () => {
    logger.info('Starting subscriptions lifecycle job...');
    try {
      await withLock('subscriptions-lifecycle', 30 * 60, async () => {
        const result = await processSubscriptionLifecycle();
        logger.info('Subscription lifecycle processing completed', result);
      });
      logger.info('Finished subscriptions lifecycle job.');
    } catch (error) {
      logger.error('Subscription lifecycle processing failed', { error });
    }
  });
}
