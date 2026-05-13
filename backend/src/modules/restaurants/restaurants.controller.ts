import type { Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { ok } from '../../utils/responses';
import { getRestaurantById, getRestaurantBySlug, phase1Store } from '../../services/phase1Store';

export function getPublicRestaurantController(req: Request, res: Response): void {
  const restaurant = getRestaurantBySlug(req.params.slug);

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  ok(res, { restaurant });
}

export function getRestaurantOverviewController(req: Request, res: Response): void {
  const restaurantId = req.user?.restaurantId ?? 'rest_1';
  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  const tables = phase1Store.tables.filter((table) => table.restaurantId === restaurantId);
  const activeSessions = phase1Store.tableSessions.filter(
    (session) => session.restaurantId === restaurantId && session.status === 'ACTIVE',
  );

  ok(res, {
    restaurant,
    metrics: {
      totalTables: tables.length,
      activeSessions: activeSessions.length,
      occupiedTables: tables.filter((table) => table.status === 'OCCUPIED').length,
    },
  });
}

export function getRestaurantSettingsController(req: Request, res: Response): void {
  const restaurantId = req.user?.restaurantId ?? 'rest_1';
  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  ok(res, {
    restaurantId: restaurant.id,
    settings: restaurant.settings,
  });
}

export function updateRestaurantSettingsController(req: Request, res: Response): void {
  const restaurantId = req.user?.restaurantId ?? 'rest_1';
  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  restaurant.settings = {
    ...restaurant.settings,
    ...req.body,
  };

  ok(res, {
    restaurantId: restaurant.id,
    settings: restaurant.settings,
  });
}
