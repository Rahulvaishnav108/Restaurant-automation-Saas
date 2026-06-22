import type { NextFunction, Request, Response } from 'express';
import { ok } from '../../utils/responses';
import { AnalyticsService } from './analytics.service';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import type { AnalyticsQueryInput } from './analytics.schema';

function getRestaurantId(req: Request): string {
  const restaurantId = req.user?.restaurantId || req.query.restaurantId;
  if (!restaurantId || typeof restaurantId !== 'string') {
    throw new AppError('Restaurant context required', 403, ErrorCode.FORBIDDEN);
  }
  return restaurantId;
}

export async function getOverviewAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const query = req.query as unknown as AnalyticsQueryInput;
    const data = await AnalyticsService.getAdminOverview(restaurantId, query);
    ok(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getRevenueAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const query = req.query as unknown as AnalyticsQueryInput;
    const data = await AnalyticsService.getRevenueAnalytics(restaurantId, query);
    ok(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getPeakHoursAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const query = req.query as unknown as AnalyticsQueryInput;
    const data = await AnalyticsService.getPeakHours(restaurantId, query);
    ok(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getRepeatCustomersAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const query = req.query as unknown as AnalyticsQueryInput;
    const data = await AnalyticsService.getRepeatCustomers(restaurantId, query);
    ok(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getKitchenPerformanceAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const query = req.query as unknown as AnalyticsQueryInput;
    const data = await AnalyticsService.getKitchenPerformance(restaurantId, query);
    ok(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getTableUtilizationAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const query = req.query as unknown as AnalyticsQueryInput;
    const data = await AnalyticsService.getTableUtilization(restaurantId, query);
    ok(res, data);
  } catch (error) {
    next(error);
  }
}

export async function getCustomerRetentionAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const query = req.query as unknown as AnalyticsQueryInput;
    const data = await AnalyticsService.getCustomerRetention(restaurantId, query);
    ok(res, { customerRetention: data });
  } catch (error) {
    next(error);
  }
}
