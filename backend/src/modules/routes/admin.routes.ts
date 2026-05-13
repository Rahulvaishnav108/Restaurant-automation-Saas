import { Router } from 'express';
import { validate } from '../../middleware/validate';
import {
  getRestaurantOverviewController,
  getRestaurantSettingsController,
  updateRestaurantSettingsController,
} from '../restaurants/restaurants.controller';
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
  updateTableRequestSchema,
} from '../tables/tables.schema';

export const adminRouter = Router();

adminRouter.get('/restaurant/overview', getRestaurantOverviewController);
adminRouter.get('/restaurant/settings', getRestaurantSettingsController);
adminRouter.patch('/restaurant/settings', updateRestaurantSettingsController);

adminRouter.post('/tables', validate(createTableRequestSchema), createTableController);
adminRouter.get('/tables', listTablesController);
adminRouter.get('/tables/:id', getTableController);
adminRouter.patch('/tables/:id', validate(updateTableRequestSchema), updateTableController);
adminRouter.delete('/tables/:id', deleteTableController);
adminRouter.post('/tables/bulk', validate(bulkCreateTablesRequestSchema), bulkCreateTablesController);
adminRouter.post('/tables/:id/qr', generateTableQrController);
adminRouter.get('/tables/:id/qr', getTableQrController);
