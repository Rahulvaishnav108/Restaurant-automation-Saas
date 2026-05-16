// src/middleware/validate.ts
// Zod validation middleware factory — validates body, query, and params

import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

/**
 * Factory middleware: validate request body, query, and/or params with Zod schemas.
 * Returns 400 VALIDATION_ERROR with field-level errors on failure.
 *
 * Usage: router.post('/users', validate({ body: createUserSchema }), handler)
 */
export function validate(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query) as any;
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params) as any;
      }
      next();
    } catch (error) {
      // Let the error handler format the ZodError
      next(error);
    }
  };
}
