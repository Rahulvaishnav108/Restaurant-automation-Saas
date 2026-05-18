// src/modules/orders/orders.controller.ts

import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { OrderStatus } from '../../constants/statuses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

export class OrdersController {
  /*
  |--------------------------------------------------------------------------
  | CUSTOMER APIs (Session-based)
  |--------------------------------------------------------------------------
  */

  static async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) throw new AppError('Session required', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.placeOrder(
        session.restaurantId,
        session._id,
        session.tableId,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) throw new AppError('Session required', 401, ErrorCode.UNAUTHORIZED);

      const orders = await OrdersService.getOrders({ sessionId: session._id });
      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSingleOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) throw new AppError('Session required', 401, ErrorCode.UNAUTHORIZED);

      const { id } = req.params;
      const order = await OrdersService.getOrderById(id, session.restaurantId);
      
      // Secondary security check for session-based access
      if (order.sessionId?.toString() !== session._id.toString()) {
        throw new AppError('Access denied to this order', 403, ErrorCode.FORBIDDEN);
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) throw new AppError('Session required', 401, ErrorCode.UNAUTHORIZED);

      const { id } = req.params;
      const result = await OrdersService.reorder(session.restaurantId, session._id, id);

      return res.status(200).json({
        success: true,
        message: `Items from previous order processed. Items added: ${result.reorderResults.successCount}, Skipped: ${result.reorderResults.skippedItems.length}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) throw new AppError('Session required', 401, ErrorCode.UNAUTHORIZED);

      const { id } = req.params;
      const order = await OrdersService.updateOrderStatus(session.restaurantId, id, OrderStatus.CANCELLED, {
        reason: 'Cancelled by customer',
      });

      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | KITCHEN APIs (JWT-based)
  |--------------------------------------------------------------------------
  */

  static async getKitchenOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Restaurant ID required', 403, ErrorCode.FORBIDDEN);

      const orders = await OrdersService.getOrders({
        restaurantId,
        status: { $in: [OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELAYED] },
      });

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async acceptOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { estimatedMinutes } = req.body;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.CONFIRMED, { estimatedMinutes });
      
      return res.status(200).json({ success: true, message: 'Order confirmed', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async startCooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.PREPARING);
      return res.status(200).json({ success: true, message: 'Cooking started', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async markReady(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.READY);
      return res.status(200).json({ success: true, message: 'Order ready for pickup', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async delayOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { delayMinutes, reason } = req.body;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.DELAYED, { delayMinutes, reason });
      return res.status(200).json({ success: true, message: 'Order delayed', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async rejectOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.REJECTED, { reason });
      return res.status(200).json({ success: true, message: 'Order rejected', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async getKitchenOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.getOrderById(id, restaurantId);
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }


  /*
  |--------------------------------------------------------------------------
  | STAFF APIs (JWT-based)
  |--------------------------------------------------------------------------
  */

  static async getReadyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Restaurant ID required', 403, ErrorCode.FORBIDDEN);

      const orders = await OrdersService.getOrders({
        restaurantId,
        status: OrderStatus.READY,
      });

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async pickFood(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.PICKED);
      return res.status(200).json({ success: true, message: 'Food picked up', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async markServed(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.SERVED);
      return res.status(200).json({ success: true, message: 'Order served', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async markCompleted(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new AppError('Unauthorized', 401, ErrorCode.UNAUTHORIZED);

      const order = await OrdersService.updateOrderStatus(restaurantId, id, OrderStatus.COMPLETED);
      return res.status(200).json({ success: true, message: 'Order completed', data: order });
    } catch (error) {
      next(error);
    }
  }
}