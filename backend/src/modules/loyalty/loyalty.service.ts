import { LoyaltyRuleModel } from './loyalty.model';
import type { CreateLoyaltyRuleInput } from './loyalty.schema';

export const defaultLoyaltyRule = {
  name: 'Default Loyalty Program',
  pointsPerVisit: 120,
  silverThreshold: 250,
  goldThreshold: 500,
  notes: 'Fallback loyalty rule used when the restaurant has not configured one yet.',
  active: true,
} as const;

export async function listLoyaltyRules(restaurantId: string) {
  return LoyaltyRuleModel.find({ restaurantId }).sort({ active: -1, updatedAt: -1 }).lean();
}

export async function createLoyaltyRule(restaurantId: string, input: CreateLoyaltyRuleInput) {
  const shouldActivate = input.active ?? true;

  if (shouldActivate) {
    await LoyaltyRuleModel.updateMany(
      { restaurantId, active: true },
      { active: false },
    );
  }

  return LoyaltyRuleModel.create({
    restaurantId,
    name: input.name,
    pointsPerVisit: input.pointsPerVisit,
    silverThreshold: input.silverThreshold,
    goldThreshold: input.goldThreshold,
    notes: input.notes ?? '',
    active: shouldActivate,
  });
}

export async function getActiveLoyaltyRule(restaurantId: string) {
  const rule = await LoyaltyRuleModel.findOne({ restaurantId, active: true }).sort({ updatedAt: -1 }).lean();

  return rule ?? defaultLoyaltyRule;
}
