// src/types/express.d.ts
// Augment Express Request with user, tableSession, and requestId

import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated staff/admin payload attached by requireAuth middleware (JWT path) */
      user?: {
        _id: string;
        email: string;
        role: string;
        restaurantId?: string;
      };
      /** Customer dining session attached by requireSession middleware (QR session path) */
      tableSession?: {
        _id: string;
        restaurantId: string;
        tableId: string;
        customerName: string;
        mobile: string;
      };
      /** Unique request identifier attached by requestId middleware */
      requestId?: string;
    }
  }
}

export {};
