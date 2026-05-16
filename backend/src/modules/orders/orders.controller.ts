// src/modules/orders/orders.controller.ts
// Order route handlers — session-based customer + JWT staff/kitchen

import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { ok } from '../../utils/responses';

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

      ok(res, { order }, 201);
      return;
    } catch (error) {
      next(error);
    }
  }

  // GET /customer/orders
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) {
        return res.status(401).json({ success: false, message: 'Session required' });
      }

      const data = await OrdersService.getCustomerOrders(session.restaurantId, session._id, {
        status: req.query.status as string | undefined,
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 10),
      });

      ok(res, data);
      return;
    } catch (error) {
      next(error);
    }
  }

  // GET /customer/orders/:id
  static async getSingleOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) {
        return res.status(401).json({ success: false, message: 'Session required' });
      }

      const { id } = req.params;
      const order = await OrdersService.getCustomerOrderById(session.restaurantId, session._id, id);
      ok(res, { order });
      return;
    } catch (error) {
      next(error);
    }
  }

  // POST /customer/orders/:id/reorder
  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) {
        return res.status(401).json({ success: false, message: 'Session required' });
      }

      const { id } = req.params;
      const order = await OrdersService.reorder(session.restaurantId, session._id, session.tableId, id);
      ok(res, { order });
      return;
    } catch (error) {
      next(error);
    }
  }

  // POST /customer/orders/:id/cancel
  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const session = req.tableSession;
      if (!session) {
        return res.status(401).json({ success: false, message: 'Session required' });
      }

      const { id } = req.params;
      const order = await OrdersService.cancelOrder(session.restaurantId, session._id, id);
      ok(res, { order });
      return;
    } catch (error) {
      next(error);
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
      ok(res, { orders });
      return;
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
      ok(res, { order });
      return;
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
      ok(res, { order });
      return;
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
      ok(res, { order });
      return;
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
      ok(res, { order });
      return;
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
      ok(res, { order });
      return;
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
      ok(res, { order });
      return;
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
  static async getReadyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const orders = await OrdersService.getReadyOrders(restaurantId);
      ok(res, { orders });
      return;
    } catch (error) {
      next(error);
    }
  }

  // PATCH /staff/orders/:id/pick
  static async pickFood(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const order = await OrdersService.pickFood(restaurantId, id);
      ok(res, { order });
      return;
    } catch (error) {
      next(error);
    }
  }

  // PATCH /staff/orders/:id/serve
  static async markServed(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) return res.status(403).json({ success: false, message: 'Restaurant ID required' });

      const { id } = req.params;
      const order = await OrdersService.markServed(restaurantId, id);
      ok(res, { order });
      return;
    } catch (error) {
      next(error);
    }
  }
}
