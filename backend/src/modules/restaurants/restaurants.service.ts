// src/modules/restaurants/restaurants.service.ts
// Business logic for the restaurants module.
// Controllers stay thin — all DB interaction lives here.

import { RestaurantModel } from './restaurants.model';
import { TableModel } from '../tables/tables.model';
import { TableSessionModel } from '../tableSessions/tableSessions.model';
import { SessionStatus, TableStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import type { UpdateRestaurantSettingsInput } from './restaurants.schema';

// ── Get public restaurant by slug ─────────────────────────────────────
export async function getRestaurantBySlug(slug: string) {
  const restaurant = await RestaurantModel.findOne({ slug }).lean();

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404, ErrorCode.NOT_FOUND);
  }

  return restaurant;
}

// ── Get restaurant by ID ──────────────────────────────────────────────
export async function getRestaurantById(restaurantId: string) {
  const restaurant = await RestaurantModel.findById(restaurantId).lean();

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404, ErrorCode.NOT_FOUND);
  }

  return restaurant;
}

// ── Get restaurant overview with live metrics ─────────────────────────
export async function getRestaurantOverview(restaurantId: string) {
  const restaurant = await getRestaurantById(restaurantId);

  const [totalTables, activeSessions, occupiedTables] = await Promise.all([
    TableModel.countDocuments({ restaurantId }),
    TableSessionModel.countDocuments({ restaurantId, status: SessionStatus.ACTIVE }),
    TableModel.countDocuments({ restaurantId, status: TableStatus.OCCUPIED }),
  ]);

  return {
    restaurant,
    metrics: {
      totalTables,
      activeSessions,
      occupiedTables,
    },
  };
}

// ── Get restaurant settings ───────────────────────────────────────────
export async function getRestaurantSettings(restaurantId: string) {
  const restaurant = await getRestaurantById(restaurantId);

  return {
    restaurantId: restaurant._id.toString(),
    settings: restaurant.settings,
  };
}

// ── Update restaurant settings ────────────────────────────────────────
export async function updateRestaurantSettings(
  restaurantId: string,
  input: UpdateRestaurantSettingsInput,
) {
  // findById without .lean() so we can call .save()
  const restaurant = await RestaurantModel.findById(restaurantId);

  if (!restaurant) {
    throw new AppError('Restaurant not found', 404, ErrorCode.NOT_FOUND);
  }

  // Shallow merge — only fields present in input are updated
  restaurant.settings = {
    ...restaurant.settings,
    ...input,
  };

  await restaurant.save();

  return {
    restaurantId: restaurant._id.toString(),
    settings: restaurant.settings,
  };
}