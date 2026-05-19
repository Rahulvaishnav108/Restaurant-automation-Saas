// src/modules/notifications/notifications.routes.ts
// REST routes for staff/admin notification operations

import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { NotificationsController } from './notifications.controller';

const router = Router();

// Secure all endpoints in this router
router.use(requireAuth);

router.get('/', NotificationsController.getNotifications);
router.patch('/read-all', NotificationsController.markAllAsRead);
router.patch('/:id/read', NotificationsController.markAsRead);

export default router;
