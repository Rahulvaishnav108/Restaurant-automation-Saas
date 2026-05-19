import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../../constants/errors';
import { AppError } from '../../utils/AppError';
import { ok } from '../../utils/responses';
import { InventoryItemModel } from './inventory.model';

function resolveRestaurantId(req: Request, candidate?: unknown): string {
  if (req.user?.restaurantId) {
    return req.user.restaurantId;
  }

  if (typeof candidate === 'string' && candidate.trim()) {
    return candidate.trim();
  }

  throw new AppError('Restaurant context required', 403, ErrorCode.FORBIDDEN);
}

export async function createInventoryItemController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.body.restaurantId);
    const existing = await InventoryItemModel.exists({
      restaurantId,
      name: req.body.name,
    });

    if (existing) {
      throw new AppError('Inventory item already exists', 409, ErrorCode.CONFLICT);
    }

    const item = await InventoryItemModel.create({
      restaurantId,
      name: req.body.name,
      stock: req.body.stock,
      unit: req.body.unit,
      threshold: req.body.threshold,
      active: req.body.active ?? true,
    });

    ok(res, { item }, 201);
  } catch (error) {
    next(error);
  }
}

export async function listInventoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.query.restaurantId);
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const filter: Record<string, unknown> = {
      restaurantId,
    };

    if (typeof req.query.active === 'boolean') {
      filter.active = req.query.active;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const items = await InventoryItemModel.find(filter).sort({ createdAt: -1 }).lean();

    ok(res, {
      items,
      meta: {
        count: items.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateInventoryItemController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.body.restaurantId ?? req.query.restaurantId);

    if (req.body.name) {
      const existing = await InventoryItemModel.exists({
        _id: { $ne: req.params.id },
        restaurantId,
        name: req.body.name,
      });

      if (existing) {
        throw new AppError('Inventory item already exists', 409, ErrorCode.CONFLICT);
      }
    }

    const item = await InventoryItemModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId,
      },
      {
        name: req.body.name,
        stock: req.body.stock,
        unit: req.body.unit,
        threshold: req.body.threshold,
        active: req.body.active,
      },
      { new: true, runValidators: true },
    ).lean();

    if (!item) {
      throw new AppError('Inventory item not found', 404, ErrorCode.NOT_FOUND);
    }

    ok(res, { item });
  } catch (error) {
    next(error);
  }
}

export async function getInventoryAlertsController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = resolveRestaurantId(req, req.query.restaurantId);
    const items = await InventoryItemModel.find({
      restaurantId,
      active: true,
      $expr: { $lte: ['$stock', '$threshold'] },
    })
      .sort({ stock: 1, threshold: 1, updatedAt: -1 })
      .lean();

    ok(res, {
      alerts: items.map((item) => ({
        ...item,
        shortage: Math.max(0, item.threshold - item.stock),
      })),
      meta: {
        count: items.length,
      },
    });
  } catch (error) {
    next(error);
  }
}
