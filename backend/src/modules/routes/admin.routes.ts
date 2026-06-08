import { Router } from 'express';
import { validate } from '../../middleware/validate';
import {
  getRestaurantOverviewController,
  getRestaurantSettingsController,
  updateRestaurantSettingsController,
} from '../restaurants/restaurants.controller';
import { updateRestaurantSettingsBodySchema } from '../restaurants/restaurants.schema';
import {
  bulkCreateTablesController,
  createTableController,
  deleteTableController,
  generateTableQrController,
  getTableController,
  getTableQrController,
  listTablesController,
  updateTableController,
} from '../tables/tables.controller';
import {
  bulkCreateTablesRequestSchema,
  createTableRequestSchema,
  tableIdParamsSchema,
  updateTableRequestSchema,
} from '../tables/tables.schema';
import analyticsRouter from '../analytics/analytics.routes';
import auditLogsRouter from '../auditLogs/auditLogs.routes';
import inventoryRouter from '../inventory/inventory.routes';
import loyaltyRouter from '../loyalty/loyalty.routes';
import offersRouter from '../offers/offers.routes';
import staffManagementRouter from '../staff/staff.routes';

export const adminRouter = Router();

adminRouter.get('/restaurant/overview', getRestaurantOverviewController);
adminRouter.get('/restaurant/settings', getRestaurantSettingsController);
adminRouter.patch(
  '/restaurant/settings',
  validate({ body: updateRestaurantSettingsBodySchema }),
  updateRestaurantSettingsController,
);

adminRouter.post('/tables', validate(createTableRequestSchema), createTableController);
adminRouter.get('/tables', listTablesController);
adminRouter.get('/tables/:id', validate({ params: tableIdParamsSchema }), getTableController);
adminRouter.patch('/tables/:id', validate(updateTableRequestSchema), updateTableController);
adminRouter.delete('/tables/:id', validate({ params: tableIdParamsSchema }), deleteTableController);
adminRouter.post('/tables/bulk', validate(bulkCreateTablesRequestSchema), bulkCreateTablesController);
adminRouter.post('/tables/:id/qr', validate({ params: tableIdParamsSchema }), generateTableQrController);
adminRouter.get('/tables/:id/qr', validate({ params: tableIdParamsSchema }), getTableQrController);
adminRouter.use('/staff', staffManagementRouter);
adminRouter.use('/offers', offersRouter);
adminRouter.use('/loyalty', loyaltyRouter);
adminRouter.use('/inventory', inventoryRouter);
adminRouter.use('/analytics', analyticsRouter);
adminRouter.use('/audit-logs', auditLogsRouter);
