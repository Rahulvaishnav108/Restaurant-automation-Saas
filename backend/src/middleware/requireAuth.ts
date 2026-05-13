import type { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler';
import { verifyAccessToken } from '../services/jwt.service';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.header('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
      restaurantId: payload.restaurantId,
      email: payload.email,
    };

    next();
  } catch {
    next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired access token'));
  }
}
