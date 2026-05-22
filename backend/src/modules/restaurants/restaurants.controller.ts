import type { Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/responses';
import { RestaurantModel } from './restaurants.model';
import { TableModel } from '../tables/tables.model';
import { TableSessionModel } from '../tableSessions/tableSessions.model';
import { SessionStatus, TableStatus } from '../../constants/statuses';

export const getPublicRestaurantController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const restaurant = await RestaurantModel.findOne({ slug: req.params.slug }).lean();

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  ok(res, { restaurant });
});

export const getRestaurantOverviewController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
});

export const getRestaurantSettingsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const restaurantId = req.user?.restaurantId;
  const restaurant = restaurantId ? await RestaurantModel.findById(restaurantId).lean() : null;

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  ok(res, {
    restaurantId: restaurant.id,
    settings: restaurant.settings,
  });
});

export const updateRestaurantSettingsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const restaurantId = req.user?.restaurantId;
  const restaurant = restaurantId ? await RestaurantModel.findById(restaurantId) : null;

  if (!restaurant) {
    throw new AppError(404, 'NOT_FOUND', 'Restaurant not found');
  }

  restaurant.settings = {
    ...restaurant.settings,
    ...req.body,
  };

  await restaurant.save();

  ok(res, {
    restaurantId: restaurant.id,
    settings: restaurant.settings,
  });
});

