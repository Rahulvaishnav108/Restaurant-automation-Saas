// src/middleware/errorHandler.ts
// Central error handler — all errors flow through here
// Never leaks stack traces in production

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
import { ErrorCode } from '../constants/errors';
import logger from '../config/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ── AppError (our custom operational errors) ───────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields && { fields: err.fields }),
      },
    });
    return;
  }

  // ── Zod Validation Error ───────────────────────────────────────────
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.') || 'unknown';
      if (!fields[path]) fields[path] = [];
      fields[path].push(issue.message);
    }

    res.status(400).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        fields,
      },
    });
    return;
  }

  // ── Mongoose Validation Error ──────────────────────────────────────
  if (err instanceof mongoose.Error.ValidationError) {
    const fields: Record<string, string[]> = {};
    for (const [key, val] of Object.entries(err.errors)) {
      fields[key] = [val.message];
    }

    res.status(400).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        fields,
      },
    });
    return;
  }

  // ── Mongoose CastError (invalid ObjectId) ──────────────────────────
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: {
        code: ErrorCode.INVALID_REQUEST,
        message: `Invalid ${err.path}: ${err.value}`,
      },
    });
    return;
  }

  // ── MongoDB Duplicate Key Error (code 11000) ───────────────────────
  if ((err as any).code === 11000) {
    const keyValue = (err as any).keyValue || {};
    const field = Object.keys(keyValue)[0] || 'field';
    res.status(409).json({
      success: false,
      error: {
        code: ErrorCode.CONFLICT,
        message: `A record with this ${field} already exists`,
      },
    });
    return;
  }

  // ── JWT Errors ─────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: ErrorCode.TOKEN_EXPIRED,
        message: 'Access token expired',
      },
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        code: ErrorCode.TOKEN_INVALID,
        message: 'Invalid token',
      },
    });
    return;
  }

  // ── Unknown / Unhandled Error ──────────────────────────────────────
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    name: err.name,
  });

  res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
}
