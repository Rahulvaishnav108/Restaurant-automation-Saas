import { Router } from 'express';
import { roles } from '../../constants/roles';
import { requireAuth } from '../../middleware/requireAuth';
import { roleGuard } from '../../middleware/roleGuard';
import { tenantGuard } from '../../middleware/tenantGuard';
import { validate } from '../../middleware/validate';
import { CleaningController } from './cleaning.controller';
import {
  cleaningTaskParamsSchema,
  cleaningTaskQuerySchema,
  completeCleaningBodySchema,
  startCleaningBodySchema,
  verifyCleaningBodySchema,
} from './cleaning.schema';

const router = Router();
const cleaningRoles = [roles.cleaningStaff, roles.restaurantAdmin] as const;

router.use(requireAuth, roleGuard(...cleaningRoles), tenantGuard);

router.get('/tasks', validate({ query: cleaningTaskQuerySchema }), CleaningController.getTasks);
router.get('/tasks/:id', validate({ params: cleaningTaskParamsSchema }), CleaningController.getTask);
router.patch(
  '/tasks/:id/start',
  validate({ params: cleaningTaskParamsSchema, body: startCleaningBodySchema }),
  CleaningController.startTask,
);
router.patch(
  '/tasks/:id/complete',
  validate({ params: cleaningTaskParamsSchema, body: completeCleaningBodySchema }),
  CleaningController.completeTask,
);
router.patch(
  '/tasks/:id/verify',
  validate({ params: cleaningTaskParamsSchema, body: verifyCleaningBodySchema }),
  CleaningController.verifyTask,
);

export default router;
