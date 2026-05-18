// src/modules/orders/orders.routes.ts
// Order route definitions — session-based customer + JWT staff/kitchen

import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { requireSession } from '../../middleware/requireSession';
import { roleGuard } from '../../middleware/roleGuard';
import { UserRole } from '../../constants/roles';
import { validate } from '../../middleware/validate';
import {
  placeOrderBodySchema,
  acceptOrderBodySchema,
  rejectOrderBodySchema,
  delayOrderBodySchema,
  orderIdParamsSchema,
  customerOrdersQuerySchema,
} from './orders.schema';
import { kitchenOrdersQuerySchema } from '../kitchen/kitchen.schema';
import { OrdersController } from './orders.controller';

const router = Router();

/*
|--------------------------------------------------------------------------
| SESSION-BASED CUSTOMER APIs (QR session token auth)
|--------------------------------------------------------------------------
*/

// Place Order
router.post(
  '/customer/orders',
  requireSession,
  validate({ body: placeOrderBodySchema }),
  OrdersController.placeOrder
);

// Get Orders
router.get('/customer/orders', requireSession, validate({ query: customerOrdersQuerySchema }), OrdersController.getOrders);

// Get Single Order
router.get('/customer/orders/:id', requireSession, validate({ params: orderIdParamsSchema }), OrdersController.getSingleOrder);

// Reorder
router.post(
  '/customer/orders/:id/reorder',
  requireSession,
  validate({ params: orderIdParamsSchema }),
  OrdersController.reorder
);

// Cancel Order
router.post(
  '/customer/orders/:id/cancel',
  requireSession,
  validate({ params: orderIdParamsSchema }),
  OrdersController.cancelOrder
);

/*
|--------------------------------------------------------------------------
| KITCHEN ORDER APIs (JWT auth — kitchen staff + admin)
|--------------------------------------------------------------------------
*/

const kitchenRoles = [UserRole.KITCHEN_STAFF, UserRole.RESTAURANT_ADMIN, UserRole.SUPER_ADMIN];

// Kitchen Dashboard Orders
router.get(
  '/kitchen/orders',
  requireAuth,
  roleGuard(...kitchenRoles),
  validate({ query: kitchenOrdersQuerySchema }),
  OrdersController.getKitchenOrders
);

// Kitchen Order Details
router.get(
  '/kitchen/orders/:id',
  requireAuth,
  roleGuard(...kitchenRoles),
  validate({ params: orderIdParamsSchema }),
  OrdersController.getKitchenOrderDetails
);

// Accept Order
router.patch(
  '/kitchen/orders/:id/accept',
  requireAuth,
  roleGuard(...kitchenRoles),
  validate({ params: orderIdParamsSchema, body: acceptOrderBodySchema }),
  OrdersController.acceptOrder
);

// Start Cooking
router.patch(
  '/kitchen/orders/:id/start',
  requireAuth,
  roleGuard(...kitchenRoles),
  validate({ params: orderIdParamsSchema }),
  OrdersController.startCooking
);

// Mark Ready
router.patch(
  '/kitchen/orders/:id/ready',
  requireAuth,
  roleGuard(...kitchenRoles),
  validate({ params: orderIdParamsSchema }),
  OrdersController.markReady
);

// Delay Order
router.patch(
  '/kitchen/orders/:id/delay',
  requireAuth,
  roleGuard(...kitchenRoles),
  validate({ params: orderIdParamsSchema, body: delayOrderBodySchema }),
  OrdersController.delayOrder
);

// Reject Order
router.patch(
  '/kitchen/orders/:id/reject',
  requireAuth,
  roleGuard(...kitchenRoles),
  validate({ params: orderIdParamsSchema, body: rejectOrderBodySchema }),
  OrdersController.rejectOrder
);

/*
|--------------------------------------------------------------------------
| SERVICE STAFF ORDER APIs (JWT auth — service staff + admin)
|--------------------------------------------------------------------------
*/

const serviceRoles = [UserRole.SERVICE_STAFF, UserRole.RESTAURANT_ADMIN, UserRole.SUPER_ADMIN];

// Ready Orders Queue
router.get('/staff/orders/ready', requireAuth, roleGuard(...serviceRoles), OrdersController.getReadyOrders);

// Pick Food
router.patch(
  '/staff/orders/:id/pick',
  requireAuth,
  roleGuard(...serviceRoles),
  validate({ params: orderIdParamsSchema }),
  OrdersController.pickFood
);

// Mark Served
router.patch(
  '/staff/orders/:id/serve',
  requireAuth,
  roleGuard(...serviceRoles),
  validate({ params: orderIdParamsSchema }),
  OrdersController.markServed
);

router.patch(
  '/staff/orders/:id/complete',
  requireAuth,
  roleGuard(...serviceRoles),
  validate({ params: orderIdParamsSchema }),
  OrdersController.markCompleted
);

export default router;
