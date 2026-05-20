// src/modules/notifications/notifications.controller.ts
// Express controllers for notifications REST API

import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { UserRole } from '../../constants/roles';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

function serializeNotification(notification: any) {
  const value = typeof notification?.toObject === 'function' ? notification.toObject() : notification;
  return {
    ...value,
    read: value?.isRead ?? value?.read ?? false,
  };
}

export class NotificationsController {
  /**
   * Get active notifications for the current restaurant.
   * Can be filtered by recipientRole and isRead status.
   */
  public static async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.restaurantId) {
        throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
      }

      const { recipientRole, isRead } = req.query;

      const filters: { recipientRole?: UserRole; isRead?: boolean } = {};

      if (recipientRole && Object.values(UserRole).includes(recipientRole as UserRole)) {
        filters.recipientRole = recipientRole as UserRole;
      }

      if (isRead !== undefined) {
        filters.isRead = isRead === 'true';
      }

      const notifications = await NotificationsService.getActiveNotifications(
        req.user.restaurantId,
        filters
      );

      res.status(200).json({
        success: true,
        data: {
          notifications: notifications.map((notification) => serializeNotification(notification)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark a single notification as read.
   */
  public static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.restaurantId || !req.user._id) {
        throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
      }

      const { id } = req.params;

      const notification = await NotificationsService.markAsRead(
        id,
        req.user.restaurantId,
        req.user._id
      );

      if (!notification) {
        throw new AppError('Notification not found', 404, ErrorCode.NOT_FOUND);
      }

      res.status(200).json({
        success: true,
        data: {
          notification: serializeNotification(notification),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all notifications of a specific role (or all roles) as read.
   */
  public static async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.restaurantId || !req.user._id) {
        throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
      }

      const recipientRoleQuery = req.query.role || req.query.recipientRole;
      let recipientRole: UserRole | undefined;

      if (recipientRoleQuery && Object.values(UserRole).includes(recipientRoleQuery as UserRole)) {
        recipientRole = recipientRoleQuery as UserRole;
      }

      await NotificationsService.markAllAsRead(
        req.user.restaurantId,
        recipientRole,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'All matching notifications marked as read successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
