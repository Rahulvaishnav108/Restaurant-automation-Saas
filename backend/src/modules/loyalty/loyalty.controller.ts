import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../../constants/errors';
import { AppError } from '../../utils/AppError';
import { ok } from '../../utils/responses';
import { createLoyaltyRule, listLoyaltyRules } from './loyalty.service';

function resolveRestaurantId(req: Request): string {
  if (!req.user?.restaurantId) {
    throw new AppError('Restaurant context required', 403, ErrorCode.FORBIDDEN);
  }

  return req.user.restaurantId;
}

export async function listLoyaltyRulesController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req);
    const rules = await listLoyaltyRules(restaurantId);

    ok(res, {
      rules,
      meta: {
        count: rules.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createLoyaltyRuleController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req);
    const rule = await createLoyaltyRule(restaurantId, req.body);

    ok(res, { rule }, 201);
  } catch (error) {
    next(error);
  }
}
