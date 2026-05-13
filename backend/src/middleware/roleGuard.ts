import type { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler';

export function roleGuard(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, 'FORBIDDEN', 'You do not have access to this resource'));
      return;
    }

    next();
  };
}
