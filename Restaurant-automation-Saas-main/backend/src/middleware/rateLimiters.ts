// src/middleware/rateLimiters.ts
// Rate limit configurations for different route groups

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/** Global API rate limiter */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
});

/** Strict rate limiter for auth endpoints */
export const authLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: env.AUTH_RATE_LIMIT_MAX_REQUESTS,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later',
    },
  },
});

/** Rate limiter for public endpoints (QR scan, booking, etc.) */
export const publicLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
});
