import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../constants/errors';
import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../services/jwt.service';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.header('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED));
    return;
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    next(new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED));
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      _id: payload._id,
      id: payload._id,
      email: payload.email,
      role: payload.role,
      restaurantId: payload.restaurantId,
    };

    next();
  } catch (error) {
    next(error as Error);
  }
}
