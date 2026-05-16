// src/middleware/requireAuth.ts
// JWT authentication middleware — verifies access token and attaches user to request

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types/auth.types';
import { AppError } from '../utils/AppError';
import { ErrorCode } from '../constants/errors';

/**
 * Middleware: Require a valid JWT access token.
 * Extracts from Authorization: Bearer <token> header.
 * Attaches decoded user to req.user.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('Authentication required', 401, ErrorCode.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
      restaurantId: decoded.restaurantId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Access token expired', 401, ErrorCode.TOKEN_EXPIRED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401, ErrorCode.TOKEN_INVALID);
    }
    throw error;
  }
}
