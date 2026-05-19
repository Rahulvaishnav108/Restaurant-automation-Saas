// src/modules/notifications/notifications.model.ts
// Notification entity — handles real-time alerts and staff-targeted messages

import mongoose, { Schema, Document, Types } from 'mongoose';
import { UserRole } from '../../constants/roles';
import { NotificationCategory, NotificationPriority } from './notifications.schema';

export interface INotification extends Document {
  restaurantId: Types.ObjectId;
  tableSessionId?: Types.ObjectId;
  recipientRole: UserRole;
  title: string;
  message: string;
  type: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  expiresAt: Date;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  readBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    tableSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'TableSession',
      default: null,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'Recipient role is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(NotificationCategory),
      default: NotificationCategory.STAFF,
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.NORMAL,
      required: [true, 'Priority is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry time is required'],
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    readBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for optimization and deduplication checks
notificationSchema.index({ restaurantId: 1, tableSessionId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ restaurantId: 1, recipientRole: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
