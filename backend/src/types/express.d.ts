import type { AppRole } from '../constants/roles';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        _id: string;
        id: string;
        email?: string;
        role: AppRole | string;
        restaurantId?: string;
      };
    }
  }
}

export {};
