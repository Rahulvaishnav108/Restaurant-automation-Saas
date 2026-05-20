import type { Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { ok } from '../../utils/responses';
import { RestaurantModel } from './restaurants.model';
import { TableModel } from '../tables/tables.model';
import { TableSessionModel } from '../tableSessions/tableSessions.model';
import { SessionStatus, TableStatus } from '../../constants/statuses';

export async function getPublicRestaurantController(req: Request, res: Response): Promise<void> {
  const restaurant = await RestaurantModel.findOne({ slug: req.params.slug }).lean();

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  ok(res, { restaurant });
}

export async function getRestaurantOverviewController(req: Request, res: Response): Promise<void> {
  const restaurantId = req.user?.restaurantId;
  const restaurant = restaurantId ? await RestaurantModel.findById(restaurantId).lean() : null;

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  const [totalTables, activeSessions, occupiedTables] = await Promise.all([
    TableModel.countDocuments({ restaurantId }),
    TableSessionModel.countDocuments({ restaurantId, status: SessionStatus.ACTIVE }),
    TableModel.countDocuments({ restaurantId, status: TableStatus.OCCUPIED }),
  ]);

  ok(res, {
    restaurant,
    metrics: {
      totalTables,
      activeSessions,
      occupiedTables,
    },
  });
}

export async function getRestaurantSettingsController(req: Request, res: Response): Promise<void> {
  const restaurantId = req.user?.restaurantId;
  const restaurant = restaurantId ? await RestaurantModel.findById(restaurantId).lean() : null;

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  ok(res, {
    restaurantId: restaurant.id,
    settings: restaurant.settings,
  });
}

export async function updateRestaurantSettingsController(req: Request, res: Response): Promise<void> {
  const restaurantId = req.user?.restaurantId;
  const restaurant = restaurantId ? await RestaurantModel.findById(restaurantId) : null;

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
