// src/middleware/roleGuard.ts
// Role-based access control middleware

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles';
import { AppError } from '../utils/AppError';
import { ErrorCode } from '../constants/errors';

/**
 * Factory middleware: restricts route access to specific roles.
 * Must be used AFTER requireAuth.
 *
 * Usage: router.get('/admin/dashboard', requireAuth, roleGuard(UserRole.RESTAURANT_ADMIN), handler)
 */
export function roleGuard(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      throw new AppError('Insufficient permissions', 403, ErrorCode.FORBIDDEN);
    }

    next();
  };
}
