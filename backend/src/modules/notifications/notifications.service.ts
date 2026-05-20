// src/modules/notifications/notifications.service.ts
// Service layer for notifications — handles creation, deduplication, real-time broadcasts, and reads

import { Notification, INotification } from './notifications.model';
import { socketService } from '../../sockets/socket.service';
import { SocketEvent } from '../../constants/events';
import { UserRole } from '../../constants/roles';
import { NotificationCategory, NotificationPriority } from './notifications.schema';
import mongoose from 'mongoose';

export class NotificationsService {
  /**
   * Create a notification.
   * Enforces a 60-second sliding window deduplication based on restaurantId, tableSessionId, and type.
   * If a duplicate is found, the existing active notification is returned and socket broadcast is suppressed.
   */
  public static async createNotification(data: {
    restaurantId: mongoose.Types.ObjectId | string;
    tableSessionId?: mongoose.Types.ObjectId | string;
    recipientRole: UserRole;
    title: string;
    message: string;
    type: string;
    category: NotificationCategory;
    priority: NotificationPriority;
    expiresAt: Date;
    metadata?: Record<string, any>;
  }): Promise<INotification> {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);

    // Sliding window check: match exact restaurant, tableSession, type, created in last 60s
    const existing = await Notification.findOne({
      restaurantId: data.restaurantId,
      tableSessionId: data.tableSessionId || null,
      type: data.type,
      createdAt: { $gte: sixtySecondsAgo },
    });

    if (existing) {
      return existing;
    }

    // Create the new notification
    const notification = await Notification.create({
      ...data,
      tableSessionId: data.tableSessionId || null,
    });

    const restaurantIdStr = data.restaurantId.toString();
    const sessionIdStr = data.tableSessionId ? data.tableSessionId.toString() : null;

    // Real-time Socket.io transmissions
    // 1. Emit to specific role in the restaurant
    socketService.emitToRole(
      restaurantIdStr,
      data.recipientRole,
      SocketEvent.NOTIFICATION_NEW,
      notification
    );

    // 2. Emit to specific active customer session (if associated)
    if (sessionIdStr) {
      socketService.emitToSession(
        sessionIdStr,
        SocketEvent.NOTIFICATION_NEW,
        notification
      );
    }

    // 3. Emit to general restaurant room
    socketService.emitToRestaurant(
      restaurantIdStr,
      SocketEvent.NOTIFICATION_NEW,
      notification
    );

    return notification;
  }

  /**
   * Get active (unexpired) notifications for a restaurant, with optional filters.
   */
  public static async getActiveNotifications(
    restaurantId: mongoose.Types.ObjectId | string,
    filters: { recipientRole?: UserRole; isRead?: boolean } = {}
  ): Promise<INotification[]> {
    const query: any = {
      restaurantId,
      expiresAt: { $gt: new Date() },
    };

    if (filters.recipientRole) {
      query.recipientRole = filters.recipientRole;
    }

    if (filters.isRead !== undefined) {
      query.isRead = filters.isRead;
    }

    return Notification.find(query).sort({ createdAt: -1 });
  }

  /**
   * Mark a single notification as read.
   */
  public static async markAsRead(
    notificationId: mongoose.Types.ObjectId | string,
    restaurantId: mongoose.Types.ObjectId | string,
    userId: mongoose.Types.ObjectId | string
  ): Promise<INotification | null> {
    const notification = await Notification.findOne({
      _id: notificationId,
      restaurantId,
    });

    if (!notification) {
      return null;
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      notification.readBy = new mongoose.Types.ObjectId(userId);
      await notification.save();
    }

    return notification;
  }

  /**
   * Mark all notifications of a specific role (or all roles if none specified) in a restaurant as read.
   */
  public static async markAllAsRead(
    restaurantId: mongoose.Types.ObjectId | string,
    recipientRole: UserRole | undefined,
    userId: mongoose.Types.ObjectId | string
  ): Promise<void> {
    const query: any = {
      restaurantId,
      isRead: false,
    };

    if (recipientRole) {
      query.recipientRole = recipientRole;
    }

    await Notification.updateMany(query, {
      $set: {
        isRead: true,
        readAt: new Date(),
        readBy: new mongoose.Types.ObjectId(userId),
      },
    });
  }
}
