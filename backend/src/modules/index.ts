import { Router } from 'express';
import { roles } from '../constants/roles';
import { requireAuth } from '../middleware/requireAuth';
import { roleGuard } from '../middleware/roleGuard';
import { authRouter } from './routes/auth.routes';
import { publicRouter } from './routes/public.routes';
import { customerRouter } from './routes/customer.routes';
import { staffRouter } from './routes/staff.routes';
import { kitchenRouter } from './routes/kitchen.routes';
import { cleaningRouter } from './routes/cleaning.routes';
import { adminRouter } from './routes/admin.routes';
import { superAdminRouter } from './routes/superAdmin.routes';
import { sharedRouter } from './routes/shared.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/public', publicRouter);
apiRouter.use('/customer', requireAuth, roleGuard(roles.customer), customerRouter);
apiRouter.use('/staff', requireAuth, roleGuard(roles.serviceStaff, roles.restaurantAdmin), staffRouter);
apiRouter.use('/kitchen', requireAuth, roleGuard(roles.kitchenStaff, roles.restaurantAdmin), kitchenRouter);
apiRouter.use('/cleaning', requireAuth, roleGuard(roles.cleaningStaff, roles.restaurantAdmin), cleaningRouter);
apiRouter.use('/admin', requireAuth, roleGuard(roles.restaurantAdmin, roles.superAdmin), adminRouter);
apiRouter.use('/super-admin', requireAuth, roleGuard(roles.superAdmin), superAdminRouter);
apiRouter.use('/', requireAuth, sharedRouter);
