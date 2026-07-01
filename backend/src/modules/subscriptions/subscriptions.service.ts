import { SubscriptionModel, ISubscription } from './subscriptions.model';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './subscriptions.schema';

export async function createSubscription(input: CreateSubscriptionInput) {
  const existing = await SubscriptionModel.findOne({ restaurantId: input.restaurantId });
  if (existing) throw new Error('Subscription already exists for restaurant');
  const doc = await SubscriptionModel.create({
    restaurantId: input.restaurantId,
    plan: input.plan,
    seats: input.seats ?? 1,
    currentPeriodEnd: new Date(input.currentPeriodEnd),
  } as Partial<ISubscription>);
  return doc;
}

export async function getSubscription(id: string) {
  return SubscriptionModel.findById(id).lean();
}

export async function listSubscriptions() {
  return SubscriptionModel.find().lean();
}

export async function updateSubscription(id: string, input: UpdateSubscriptionInput) {
  const sub = await SubscriptionModel.findByIdAndUpdate(id, input, { new: true });
  if (!sub) throw new Error('Subscription not found');
  return sub;
}

export async function setStatus(id: string, status: string) {
  const sub = await SubscriptionModel.findByIdAndUpdate(id, { status }, { new: true });
  if (!sub) throw new Error('Subscription not found');
  return sub;
}

export async function activate(id: string) {
  return setStatus(id, 'active');
}

export async function cancel(id: string, immediate = true) {
  if (immediate) {
    return setStatus(id, 'cancelled');
  }
  // schedule cancellation at period end
  const sub = await SubscriptionModel.findById(id);
  if (!sub) throw new Error('Subscription not found');
  // mark as cancelled but keep active until period end
  sub.status = 'cancelled';
  await sub.save();
  return sub;
}

export async function renew(id: string, days = 30) {
  const sub = await SubscriptionModel.findById(id);
  if (!sub) throw new Error('Subscription not found');
  sub.currentPeriodEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await sub.save();
  return sub;
}

export async function incrementUsage(restaurantId: string, key: string, delta = 1) {
  await SubscriptionModel.updateOne({ restaurantId }, { $inc: { [`usage.${key}`]: delta } });
}
