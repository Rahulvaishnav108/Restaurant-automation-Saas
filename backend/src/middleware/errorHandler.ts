import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';

type ErrorCode =
  | 'INTERNAL_SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'TOO_MANY_REQUESTS';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const normalizedError =
    error instanceof AppError
      ? error
      : error instanceof ZodError
        ? new AppError(400, 'VALIDATION_ERROR', 'Validation failed', error.flatten())
        : new AppError(500, 'INTERNAL_SERVER_ERROR', 'Something went wrong');

  if (normalizedError.statusCode >= 500) {
    logger.error(normalizedError.message, {
      path: req.originalUrl,
      method: req.method,
      requestId: req.requestId,
      stack: error.stack,
    });
  } else {
    logger.warn(normalizedError.message, {
      code: normalizedError.code,
      path: req.originalUrl,
      method: req.method,
      requestId: req.requestId,
    });
  }

  res.status(normalizedError.statusCode).json({
    success: false,
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
      details: normalizedError.details,
      requestId: req.requestId,
    },
  });
}
