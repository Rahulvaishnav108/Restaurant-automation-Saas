import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../constants/errors';
import { verifyAccessToken } from '../services/jwt.service';
import { AppError } from '../utils/AppError';

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

export function attachUser(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = verifyAccessToken(token);

        req.user = {
          _id: decoded._id,
          id: decoded._id,
          email: decoded.email,
          role: decoded.role,
          restaurantId: decoded.restaurantId,
        };
      } catch {
        // Silent fail; req.user remains undefined.
      }
    }
  }

  next();
}
