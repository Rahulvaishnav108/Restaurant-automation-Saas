import mongoose from 'mongoose';
import { SubscriptionModel, SubscriptionEventModel, ISubscription, SubscriptionEventType } from './subscriptions.model';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscriptions.schema';
import { PlatformPlanModel } from '../superAdmin/superAdmin.model';
import { RestaurantModel } from '../restaurants/restaurants.model';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationCategory, NotificationPriority } from '../notifications/notifications.schema';
import { UserRole } from '../../constants/roles';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

async function resolvePlanDetails(plan: string) {
  const planDoc = await PlatformPlanModel.findOne({ name: plan }).lean();
  if (!planDoc) {
    throw new AppError(`Subscription plan '${plan}' not found`, 400, ErrorCode.INVALID_REQUEST);
  }
  return planDoc;
}

async function resolvePlanTenantLimit(plan: string) {
  const planDoc = await resolvePlanDetails(plan);
  return planDoc.tenantLimit;
}

async function resolvePlanUsageLimit(plan: string) {
  const planDoc = await resolvePlanDetails(plan);
  return planDoc.usageLimit ?? Number.POSITIVE_INFINITY;
}

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

async function syncRestaurantPlan(restaurantId: string | mongoose.Types.ObjectId, plan: string) {
  try {
    const result = RestaurantModel.findByIdAndUpdate(restaurantId, { plan }, { new: true });
    await Promise.resolve(result).catch(() => null);
  } catch {
    return null;
  }
}

async function logSubscriptionEvent(
  subscriptionId: string,
  restaurantId: string,
  type: SubscriptionEventType,
  metadata: Record<string, any> = {},
) {
  try {
    await SubscriptionEventModel.create({
      subscriptionId: new mongoose.Types.ObjectId(subscriptionId),
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      type,
      metadata,
    });
  } catch {
    return null;
  }
}




async function sendSubscriptionNotification(
  restaurantId: string,
  title: string,
  message: string,
  type: string,
) {
  try {
    const result = NotificationsService.createNotification({
      restaurantId,
      recipientRole: UserRole.RESTAURANT_ADMIN,
      title,
      message,
      type,
      category: NotificationCategory.SYSTEM,
      priority: NotificationPriority.HIGH,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await Promise.resolve(result).catch(() => null);
  } catch {
    return null;
  }
}

function shouldNotifyUsageWarning(currentUsage: number, newUsage: number, usageLimit: number) {
  if (!Number.isFinite(usageLimit)) return false;
  const threshold = Math.floor(usageLimit * 0.8);
  return currentUsage < threshold && newUsage >= threshold && threshold > 0;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function buildUsageReportEntries(usage: Record<string, number>, usageLimit: number) {
  return Object.entries(usage).map(([key, currentUsage]) => {
    const remaining = Math.max(usageLimit - currentUsage, 0);
    return {
      key,
      currentUsage,
      usageLimit,
      remaining,
      percentUsed: usageLimit > 0 ? roundToTwoDecimals((currentUsage / usageLimit) * 100) : 0,
    };
  });
}

type SubscriptionUsageSummary = {
  plan?: string;
  status?: string;
  usage?: Record<string, number>;
};

function buildPlanUsageSummary(subscriptions: Array<SubscriptionUsageSummary>) {
  const planBuckets = new Map<
    string,
    {
      plan: string;
      totalSubscriptions: number;
      activeSubscriptions: number;
      usageKeys: Map<string, { totalUsage: number; maxUsage: number; sampleCount: number }>;
    }
  >();

  for (const sub of subscriptions) {
    const planName = sub.plan ?? 'UNKNOWN';
    const usage = sub.usage ?? {};
    const bucket = planBuckets.get(planName) ?? {
      plan: planName,
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      usageKeys: new Map(),
    };

    bucket.totalSubscriptions += 1;
    if (sub.status === 'active') {
      bucket.activeSubscriptions += 1;
    }

    Object.entries(usage).forEach(([key, currentUsage]) => {
      const keyMetrics = bucket.usageKeys.get(key) ?? {
        totalUsage: 0,
        maxUsage: 0,
        sampleCount: 0,
      };
      keyMetrics.totalUsage += currentUsage;
      keyMetrics.maxUsage = Math.max(keyMetrics.maxUsage, currentUsage);
      keyMetrics.sampleCount += 1;
      bucket.usageKeys.set(key, keyMetrics);
    });

    planBuckets.set(planName, bucket);
  }

  return Array.from(planBuckets.values());
}

function getPlanUsageLimit(planName: string, planDocs: Array<{ name: string; usageLimit?: number }>) {
  const planDoc = planDocs.find((plan) => plan.name === planName);
  return planDoc?.usageLimit ?? Number.POSITIVE_INFINITY;
}

function validateSeatsAgainstPlanLimit(seats: number, tenantLimit: number) {
  if (seats > tenantLimit) {
    throw new AppError(
      `Requested seats (${seats}) exceed plan tenant limit (${tenantLimit})`,
      400,
      ErrorCode.TENANT_VIOLATION,
    );
  }
}

export async function createSubscription(input: CreateSubscriptionInput) {
const existing = await SubscriptionModel.findOne({ restaurantId: input.restaurantId });
  if (existing) throw new AppError('Subscription already exists for restaurant', 409, ErrorCode.CONFLICT);

  const tenantLimit = await resolvePlanTenantLimit(input.plan);
  const seats = input.seats ?? 1;
  validateSeatsAgainstPlanLimit(seats, tenantLimit);

  const doc = await SubscriptionModel.create({
    restaurantId: input.restaurantId as any,
    plan: input.plan,
    planId: undefined,
    seats,
    currentPeriodEnd: new Date(input.currentPeriodEnd),
  } as unknown as Partial<ISubscription>);


await syncRestaurantPlan(input.restaurantId as any, input.plan);
  await sendSubscriptionNotification(
    input.restaurantId as any,
    'Subscription created',
    `Subscription for plan ${input.plan} was created with ${seats} seats`,
    'SUBSCRIPTION_CREATED',
  );

  return doc;
}

export async function getSubscription(id: string) {
  return SubscriptionModel.findById(id).lean();
}

export async function getSubscriptionUsage(id: string) {
  const sub = await SubscriptionModel.findById(id);
  if (!sub) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);
  return sub.usage ?? {};
}

export async function getSubscriptionUsageReport(id: string) {
  const sub = await SubscriptionModel.findById(id);
  if (!sub) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);
  const usage = sub.usage ?? {};
  const usageLimit = await resolvePlanUsageLimit(sub.plan);

  return {
    subscriptionId: sub._id.toString(),
    plan: sub.plan,
    status: sub.status,
    usageReport: buildUsageReportEntries(usage, usageLimit),
    usageLimit,
    updatedAt: sub.updatedAt ?? sub.createdAt,
  };
}

export async function listSubscriptions() {
  return SubscriptionModel.find().lean();
}

export async function getPlanUsageAnalytics() {
  const subscriptions = await SubscriptionModel.find().lean() as SubscriptionUsageSummary[];
  const planNames = Array.from(new Set(subscriptions.map((sub) => sub.plan ?? 'UNKNOWN')));
  const planDocs = await PlatformPlanModel.find({ name: { $in: planNames } }).lean();

  const planUsageRows = buildPlanUsageSummary(subscriptions).map((bucket) => {
    const usageLimit = getPlanUsageLimit(bucket.plan, planDocs);
    const usageEntries = Array.from(bucket.usageKeys.entries()).map(([key, metrics]) => ({
      key,
      averageUsage: metrics.sampleCount > 0 ? roundToTwoDecimals(metrics.totalUsage / metrics.sampleCount) : 0,
      peakUsage: metrics.maxUsage,
      sampleCount: metrics.sampleCount,
      usageLimit,
      averagePercentUsed: usageLimit > 0 ? roundToTwoDecimals((metrics.totalUsage / metrics.sampleCount / usageLimit) * 100) : 0,
    }));

    return {
      plan: bucket.plan,
      totalSubscriptions: bucket.totalSubscriptions,
      activeSubscriptions: bucket.activeSubscriptions,
      usageMetrics: usageEntries,
    };
  });

  return {
    planUsage: planUsageRows,
    totalPlans: planUsageRows.length,
    totalSubscriptions: subscriptions.length,
  };
}

export async function updateSubscription(id: string, input: UpdateSubscriptionInput) {
  const existingSubscription = await SubscriptionModel.findById(id);
  if (!existingSubscription) {
    throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);
  }

  const targetPlan = input.plan ?? existingSubscription.plan;
  const targetSeats = input.seats ?? existingSubscription.seats ?? 1;
  const tenantLimit = await resolvePlanTenantLimit(targetPlan);
  validateSeatsAgainstPlanLimit(targetSeats, tenantLimit);

  const sub = await SubscriptionModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  if (!sub) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);

  if (input.plan && input.plan !== existingSubscription.plan) {
    await syncRestaurantPlan(existingSubscription.restaurantId, input.plan);
    await sendSubscriptionNotification(
      existingSubscription.restaurantId.toString(),
      'Subscription plan updated',
      `Your subscription plan has been updated from ${existingSubscription.plan} to ${input.plan}.`,
      'SUBSCRIPTION_PLAN_UPDATED',
    );
  }

  return sub;
}

export async function setStatus(id: string, status: string) {
  const sub = await SubscriptionModel.findByIdAndUpdate(id, { status }, { new: true });
  if (!sub) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);
  return sub;
}

export async function activate(id: string) {
  const sub = await setStatus(id, 'active');
  await sendSubscriptionNotification(
    sub.restaurantId.toString(),
    'Subscription activated',
    `Subscription ${sub._id.toString()} is now active.`,
    'SUBSCRIPTION_ACTIVATED',
  );
  return sub;
}

export async function cancel(id: string, immediate = true) {
  if (immediate) {
    const sub = await setStatus(id, 'cancelled');
    await sendSubscriptionNotification(
      sub.restaurantId.toString(),
      'Subscription cancelled',
      `Subscription ${sub._id.toString()} has been cancelled.`,
      'SUBSCRIPTION_CANCELLED',
    );
    return sub;
  }
  // schedule cancellation at period end
  const sub = await SubscriptionModel.findById(id);
  if (!sub) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);
  // mark as cancelled but keep active until period end
sub.status = 'cancelled' as any;
  await sub.save();
  await sendSubscriptionNotification(
    sub.restaurantId.toString(),
    'Subscription cancellation scheduled',
    `Subscription ${sub._id.toString()} has been scheduled for cancellation at the end of the current period.`,
    'SUBSCRIPTION_CANCELLATION_SCHEDULED',
  );
  return sub;
}

export async function renew(id: string, days = 30) {
  const sub = await SubscriptionModel.findById(id);
  if (!sub) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);
  sub.currentPeriodEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await sub.save();
  await sendSubscriptionNotification(
    sub.restaurantId.toString(),
    'Subscription renewed',
    `Subscription ${sub._id.toString()} has been renewed for an additional ${days} days.`,
    'SUBSCRIPTION_RENEWED',
  );
  return sub;
}

export async function incrementUsage(id: string, key: string, delta = 1) {
  const sub = await SubscriptionModel.findById(id);
  if (!sub) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);
  if (sub.status !== 'active') {
    throw new AppError('Cannot record usage for inactive subscription', 400, ErrorCode.INVALID_REQUEST);
  }

  const usageLimit = await resolvePlanUsageLimit(sub.plan);
  const currentUsage = sub.usage?.[key] ?? 0;
  const newUsage = currentUsage + delta;

  const reachedLimit = newUsage >= usageLimit;
  const overLimit = newUsage > usageLimit;
  const thresholdCrossed = shouldNotifyUsageWarning(currentUsage, newUsage, usageLimit);

  if (overLimit) {
    await sendSubscriptionNotification(
      sub.restaurantId.toString(),
      'Subscription usage limit reached',
      `Usage for '${key}' has exceeded the plan limit of ${usageLimit}. Please upgrade your plan to continue.`,
      'SUBSCRIPTION_USAGE_LIMIT_EXCEEDED',
    );
    throw new AppError(
      `Usage for '${key}' (${newUsage}) exceeds plan limit (${usageLimit})`,
      400,
      ErrorCode.USAGE_LIMIT_EXCEEDED,
    );
  }

  await SubscriptionModel.updateOne({ _id: id }, { $inc: { [`usage.${key}`]: delta } });
  const updated = await SubscriptionModel.findById(id);
  if (!updated) throw new AppError('Subscription not found', 404, ErrorCode.NOT_FOUND);

  if (reachedLimit) {
    await sendSubscriptionNotification(
      updated.restaurantId.toString(),
      'Subscription usage cap reached',
      `Usage for '${key}' has reached the plan limit of ${usageLimit}. Upgrade your subscription to avoid interruptions.`,
      'SUBSCRIPTION_USAGE_LIMIT_REACHED',
    );
  } else if (thresholdCrossed) {
    await sendSubscriptionNotification(
      updated.restaurantId.toString(),
      'Subscription usage warning',
      `Usage for '${key}' is now ${newUsage}/${usageLimit} (${roundToTwoDecimals((newUsage / usageLimit) * 100)}%).`,
      'SUBSCRIPTION_USAGE_WARNING',
    );
  }

  return updated;
}
