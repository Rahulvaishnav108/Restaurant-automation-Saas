import type { Request } from 'express';
import { Types } from 'mongoose';
import { AuditLogModel, IAuditLog } from './auditLogs.model';

export interface LogAuditActionParams {
  req?: Request;
  actorId?: string | Types.ObjectId | null;
  actorRole?: string;
  restaurantId?: string | Types.ObjectId | null;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Global highly-reusable helper to safely write audit logs asynchronously.
 * Wraps operations in a try-catch block to completely isolate audit logging
 * failures from impacting primary transactions.
 */
export async function logAuditAction(params: LogAuditActionParams): Promise<void> {
  try {
    const { req, entityType, entityId, action, metadata = {} } = params;

    let actorId: Types.ObjectId | null = null;
    let actorRole = 'system';
    let restaurantId: Types.ObjectId | null = null;
    let ipAddress = '';
    let userAgent = '';

    // 1. Extract context automatically if Express Request is provided
    if (req) {
      if (req.user) {
        if (req.user._id) actorId = new Types.ObjectId(req.user._id);
        if (req.user.role) actorRole = req.user.role;
        if (req.user.restaurantId) restaurantId = new Types.ObjectId(req.user.restaurantId);
      } else if (req.tableSession) {
        if (req.tableSession._id) actorId = new Types.ObjectId(req.tableSession._id);
        actorRole = 'customer';
        if (req.tableSession.restaurantId) restaurantId = new Types.ObjectId(req.tableSession.restaurantId);
      }

      ipAddress = req.ip || (req.headers['x-forwarded-for'] as string) || '';
      userAgent = req.headers['user-agent'] || '';
    }

    // 2. Apply explicit parameter overrides if passed
    if (params.actorId) {
      actorId = typeof params.actorId === 'string' ? new Types.ObjectId(params.actorId) : params.actorId;
    }
    if (params.actorRole) {
      actorRole = params.actorRole;
    }
    if (params.restaurantId) {
      restaurantId = typeof params.restaurantId === 'string' ? new Types.ObjectId(params.restaurantId) : params.restaurantId;
    }
    if (params.ipAddress) {
      ipAddress = params.ipAddress;
    }
    if (params.userAgent) {
      userAgent = params.userAgent;
    }

    // 3. Persist the log
    await AuditLogModel.create({
      actorId,
      actorRole,
      restaurantId,
      entityType,
      entityId,
      action,
      metadata,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    // Log the failure to winston/console, but suppress propagation to protect core workflows
    console.error('Failed to persist audit log:', error);
  }
}

/**
 * Retrieves audit logs matching the query filters with pagination.
 */
export async function queryAuditLogs(
  filters: {
    restaurantId?: string | Types.ObjectId;
    role?: string;
    action?: string;
    entityType?: string;
    from?: string;
    to?: string;
  },
  pagination: { page: number; limit: number },
): Promise<{ logs: IAuditLog[]; total: number }> {
  const query: Record<string, any> = {};

  if (filters.restaurantId) {
    query.restaurantId = typeof filters.restaurantId === 'string' ? new Types.ObjectId(filters.restaurantId) : filters.restaurantId;
  }
  if (filters.role) {
    query.actorRole = filters.role;
  }
  if (filters.action) {
    query.action = filters.action;
  }
  if (filters.entityType) {
    query.entityType = filters.entityType;
  }

  // Handle date-range filtering
  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      // If simple YYYY-MM-DD is passed, make sure to include the whole day by setting end of day
      const toDate = new Date(filters.to);
      if (filters.to.length === 10) {
        toDate.setUTCHours(23, 59, 59, 999);
      }
      query.createdAt.$lte = toDate;
    }
  }

  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec() as unknown as Promise<IAuditLog[]>,
    AuditLogModel.countDocuments(query).exec(),
  ]);

  return { logs, total };
}

/**
 * Fetches a single audit log entry by ID.
 */
export async function getAuditLogById(id: string): Promise<IAuditLog | null> {
  return AuditLogModel.findById(id).lean().exec() as unknown as Promise<IAuditLog | null>;
}
