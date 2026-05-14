// src/types/express.d.ts
// Augment Express Request with user and requestId

import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user payload attached by requireAuth middleware */
      user?: {
        _id: string;
        email: string;
        role: string;
        restaurantId?: string;
      };
      /** Unique request identifier attached by requestId middleware */
      requestId?: string;
    }
  }
}

export {};
