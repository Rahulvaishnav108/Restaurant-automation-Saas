import { Router } from 'express';
import { validate } from '../../middleware/validate';
import {
  createInventoryItemBodySchema,
  inventoryItemParamsSchema,
  inventoryQuerySchema,
  updateInventoryItemBodySchema,
} from './inventory.schema';
import {
  createInventoryItemController,
  getInventoryAlertsController,
  listInventoryController,
  updateInventoryItemController,
} from './inventory.controller';

const router = Router();

router.get('/', validate({ query: inventoryQuerySchema }), listInventoryController);
router.post('/', validate({ body: createInventoryItemBodySchema }), createInventoryItemController);
router.get('/alerts', validate({ query: inventoryQuerySchema }), getInventoryAlertsController);
router.patch(
  '/:id',
  validate({ params: inventoryItemParamsSchema, body: updateInventoryItemBodySchema }),
  updateInventoryItemController,
);

export default router;
