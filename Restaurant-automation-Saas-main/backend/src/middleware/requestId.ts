// src/middleware/requestId.ts
// Attach a unique request ID to each request for logging and tracing

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Headers } from '../utils/constants';

/**
 * Middleware: Generate a unique request ID and attach to req + response header.
 * Used for log correlation and debugging.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = crypto.randomUUID();
  req.requestId = id;
  res.setHeader(Headers.REQUEST_ID, id);
  next();
}
