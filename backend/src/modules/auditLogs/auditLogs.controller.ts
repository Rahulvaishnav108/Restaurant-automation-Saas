import { Request, Response, NextFunction } from 'express';
import { ok } from '../../utils/responses';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { roles } from '../../constants/roles';
import * as auditLogsService from './auditLogs.service';

/**
 * Controller: Handles query operations for fetching audit logs.
 * Enforces role and tenant isolation:
 * - RESTAURANT_ADMIN: restricted entirely to logs within their own restaurantId.
 * - SUPER_ADMIN: can query all restaurants or filter freely.
 */
export async function getAuditLogsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userRole = req.user?.role;
    const userRestaurantId = req.user?.restaurantId;

    let targetRestaurantId = req.query.restaurantId as string | undefined;

    // Enforce tenant boundary validation
    if (userRole === roles.restaurantAdmin) {
      if (!userRestaurantId) {
        throw new AppError('Restaurant Admin lacks a bound restaurant ID', 403, ErrorCode.FORBIDDEN);
      }
      // Force restriction to the admin's own restaurant
      targetRestaurantId = userRestaurantId;
    }

    const filters = {
      restaurantId: targetRestaurantId,
      role: req.query.role as string | undefined,
      action: req.query.action as string | undefined,
      entityType: req.query.entityType as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
    };

    const pagination = {
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 20),
    };

    const { logs, total } = await auditLogsService.queryAuditLogs(filters, pagination);

    const totalPages = Math.ceil(total / pagination.limit);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Handles fetching a single audit log entry by ID.
 * Enforces strict boundary checks to prevent cross-tenant data leaks.
 */
export async function getAuditLogByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userRole = req.user?.role;
    const userRestaurantId = req.user?.restaurantId;

    const log = await auditLogsService.getAuditLogById(req.params.id);

    if (!log) {
      throw new AppError('Audit log entry not found', 404, ErrorCode.NOT_FOUND);
    }

    // Tenant check: RESTAURANT_ADMIN can only view logs of their own restaurant
    if (userRole === roles.restaurantAdmin) {
      if (!userRestaurantId || !log.restaurantId || log.restaurantId.toString() !== userRestaurantId) {
        // Return 404 to avoid confirming existence of a record belonging to another tenant
        throw new AppError('Audit log entry not found', 404, ErrorCode.NOT_FOUND);
      }
    }

    ok(res, log);
  } catch (error) {
    next(error);
  }
}
