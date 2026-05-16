// src/modules/orders/orders.controller.ts
// Order route handlers — session-based customer + JWT staff/kitchen

import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';

export class OrdersController {
  /*
  |--------------------------------------------------------------------------
  | SESSION-BASED CUSTOMER APIs
  | Customer authenticated via QR session token (req.tableSession)
  |--------------------------------------------------------------------------
  */

  // POST /customer/orders
  static async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) {
        return res.status(401).json({ success: false, message: 'Session required' });
      }

      const order = await OrdersService.placeOrder(
        session.restaurantId,
        session._id,
        session.tableId,
        session.customerName,
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

  // GET /customer/orders
  static async getOrders(req: Request, res: Response) {
    try {
      const session = req.tableSession;
      return res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: {
          restaurantId: session?.restaurantId,
          tableId: session?.tableId,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error,
      });
    }
  }

  // GET /customer/orders/:id
  static async getSingleOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      return res.status(200).json({
        success: true,
        message: `Order ${id} fetched successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error,
      });
    }
  }

  // POST /customer/orders/:id/reorder
  static async reorder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      return res.status(200).json({
        success: true,
        message: `Reorder created from order ${id}`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to reorder',
        error,
      });
    }
  }

  // POST /customer/orders/:id/cancel
  static async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      return res.status(200).json({
        success: true,
        message: `Order ${id} cancelled successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel order',
        error,
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | KITCHEN ORDER APIs (JWT auth — req.user)
  |--------------------------------------------------------------------------
  */

  // GET /kitchen/orders
  static async getKitchenOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const orders = await OrdersService.getKitchenOrders(restaurantId);
      return res.status(200).json({
        success: true,
        message: 'Kitchen orders fetched successfully',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /kitchen/orders/:id
  static async getKitchenOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const order = await OrdersService.getKitchenOrderDetails(restaurantId, id);
      return res.status(200).json({
        success: true,
        message: `Kitchen order ${id} fetched successfully`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /kitchen/orders/:id/accept
  static async acceptOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const { estimatedPreparationTime } = req.body;
      const order = await OrdersService.acceptOrder(restaurantId, id, estimatedPreparationTime);
      return res.status(200).json({
        success: true,
        message: `Order ${id} accepted`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /kitchen/orders/:id/start
  static async startCooking(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const order = await OrdersService.startCooking(restaurantId, id);
      return res.status(200).json({
        success: true,
        message: `Cooking started for order ${id}`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /kitchen/orders/:id/ready
  static async markReady(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const order = await OrdersService.markReady(restaurantId, id);
      return res.status(200).json({
        success: true,
        message: `Order ${id} marked as ready`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /kitchen/orders/:id/delay
  static async delayOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const { delayMinutes } = req.body;
      const order = await OrdersService.delayOrder(restaurantId, id, delayMinutes);
      return res.status(200).json({
        success: true,
        message: `Order ${id} delayed`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /kitchen/orders/:id/reject
  static async rejectOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const { reason } = req.body;
      const order = await OrdersService.rejectOrder(restaurantId, id, reason);
      return res.status(200).json({
        success: true,
        message: `Order ${id} rejected`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SERVICE STAFF ORDER APIs (JWT auth — req.user)
  |--------------------------------------------------------------------------
  */

  // GET /staff/orders/ready
  static async getReadyOrders(req: Request, res: Response) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Ready orders fetched successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch ready orders',
        error,
      });
    }
  }

  // PATCH /staff/orders/:id/pick
  static async pickFood(req: Request, res: Response) {
    try {
      const { id } = req.params;
      return res.status(200).json({
        success: true,
        message: `Food picked for order ${id}`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to pick food',
        error,
      });
    }
  }

  // PATCH /staff/orders/:id/serve
  static async markServed(req: Request, res: Response) {
    try {
      const { id } = req.params;
      return res.status(200).json({
        success: true,
        message: `Order ${id} served successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to serve order',
        error,
      });
    }
  }
}