import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const headerValue = req.header('x-request-id');
  const id = headerValue && headerValue.trim() ? headerValue : randomUUID();

  req.requestId = id;
  res.setHeader('x-request-id', id);

  next();
}
