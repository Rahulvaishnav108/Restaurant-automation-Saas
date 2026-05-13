import type { AppRole } from '../constants/roles';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        role: AppRole;
        restaurantId?: string;
        email?: string;
      };
    }
  }
}

export {};
