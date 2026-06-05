import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../../constants/errors';
import { AppError } from '../../utils/AppError';
import { ok } from '../../utils/responses';
import { logAuditAction } from '../auditLogs/auditLogs.service';
import { OrdersService } from '../orders/orders.service';
import { KitchenService } from './kitchen.service';

export class KitchenController {
  private static getRequiredRestaurantId(req: Request) {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      throw new AppError('Restaurant context required', 403, ErrorCode.FORBIDDEN);
    }

    return restaurantId;
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const metrics = await KitchenService.getDashboard(restaurantId);

      ok(res, { metrics });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const orders = await KitchenService.getOrders(restaurantId, {
        status: req.query.status as any,
        priority: req.query.priority as string | undefined,
        table: req.query.table as string | undefined,
        batch: req.query.batch as boolean | undefined,
      });

      ok(res, {
        orders,
        meta: {
          count: orders.length,
          filters: {
            status: req.query.status ?? null,
            priority: req.query.priority ?? null,
            table: req.query.table ?? null,
            batch: req.query.batch ?? null,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const order = await KitchenService.getOrderDetails(restaurantId, req.params.id);

      ok(res, { order });
    } catch (error) {
      next(error);
    }
  }

  static async acceptOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const order = await OrdersService.acceptOrder(
        restaurantId,
        req.params.id,
        req.body.estimatedPreparationTime,
        req.user?.id,
      );

      logAuditAction({
        req,
        entityType: 'order',
        entityId: order._id.toString(),
        action: 'ORDER_ACCEPTED',
        metadata: { estimatedPreparationTime: req.body.estimatedPreparationTime },
      });

      ok(res, { order });
    } catch (error) {
      next(error);
    }
  }

  static async startCooking(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const order = await OrdersService.startCooking(restaurantId, req.params.id, req.user?.id);

      logAuditAction({
        req,
        entityType: 'order',
        entityId: order._id.toString(),
        action: 'ORDER_COOKING_STARTED',
      });

      ok(res, { order });
    } catch (error) {
      next(error);
    }
  }

  static async markReady(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const order = await OrdersService.markReady(restaurantId, req.params.id, req.user?.id);

      logAuditAction({
        req,
        entityType: 'order',
        entityId: order._id.toString(),
        action: 'ORDER_PREPARED',
      });

      ok(res, { order });
    } catch (error) {
      next(error);
    }
  }

  static async delayOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const order = await OrdersService.delayOrder(restaurantId, req.params.id, req.body.delayMinutes, req.user?.id);

      logAuditAction({
        req,
        entityType: 'order',
        entityId: order._id.toString(),
        action: 'ORDER_DELAYED',
        metadata: { delayMinutes: req.body.delayMinutes },
      });

      ok(res, { order });
    } catch (error) {
      next(error);
    }
  }

  static async rejectOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const order = await OrdersService.rejectOrder(restaurantId, req.params.id, req.body.reason, req.user?.id);

      logAuditAction({
        req,
        entityType: 'order',
        entityId: order._id.toString(),
        action: 'ORDER_REJECTED',
        metadata: { reason: req.body.reason },
      });

      ok(res, { order });
    } catch (error) {
      next(error);
    }
  }

  static async getBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const batches = await KitchenService.getBatches(restaurantId);

      ok(res, {
        batches,
        meta: {
          count: batches.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const batch = await KitchenService.getBatchById(restaurantId, req.params.id);

      ok(res, { batch });
    } catch (error) {
      next(error);
    }
  }

  static async createBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const batch = await KitchenService.createBatch(restaurantId, req.body);

      logAuditAction({
        req,
        entityType: 'kitchen-batch',
        entityId: batch._id.toString(),
        action: 'KITCHEN_BATCH_CREATED',
        metadata: { orderIds: req.body.orderIds, station: req.body.station },
      });

      ok(res, { batch }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const batch = await KitchenService.updateBatch(restaurantId, req.params.id, req.body);

      logAuditAction({
        req,
        entityType: 'kitchen-batch',
        entityId: batch._id.toString(),
        action: 'KITCHEN_BATCH_UPDATED',
        metadata: req.body,
      });

      ok(res, { batch });
    } catch (error) {
      next(error);
    }
  }

  static async getLoad(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const stations = await KitchenService.getStationLoad(restaurantId);

      ok(res, {
        stations,
        meta: {
          count: stations.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = KitchenController.getRequiredRestaurantId(req);
      const chefs = await KitchenService.getPerformance(restaurantId);

      ok(res, {
        chefs,
        meta: {
          count: chefs.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
