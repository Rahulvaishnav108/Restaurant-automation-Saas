import { Router } from 'express';
import { z } from 'zod';
import * as controller from './subscriptions.controller';
import { validate } from '../../middleware/validate';
import { createSubscriptionSchema, updateSubscriptionSchema, subscriptionIdParam, lifecycleActionSchema, renewSchema, usageUpdateSchema } from './subscriptions.schema';

const router = Router();

router.post('/', validate({ body: createSubscriptionSchema }), controller.create);
router.get('/', controller.list);
router.get('/:id', validate({ params: subscriptionIdParam }), controller.getOne);
router.patch('/:id', validate({ params: subscriptionIdParam, body: updateSubscriptionSchema }), controller.patch);
router.post(
	'/:id/status',
	validate({ params: subscriptionIdParam, body: z.object({ status: z.enum(['active', 'cancelled', 'past_due', 'suspended']) }) }),
	controller.setStatus,
);

router.post('/:id/activate', validate({ params: subscriptionIdParam, body: lifecycleActionSchema }), controller.activate);
router.post('/:id/cancel', validate({ params: subscriptionIdParam, body: lifecycleActionSchema }), controller.cancel);
router.post('/:id/renew', validate({ params: subscriptionIdParam, body: renewSchema }), controller.renew);
router.get('/:id/usage', validate({ params: subscriptionIdParam }), controller.getUsage);
router.get('/:id/usage/report', validate({ params: subscriptionIdParam }), controller.getUsageReport);
router.patch('/:id/usage', validate({ params: subscriptionIdParam, body: usageUpdateSchema }), controller.incrementUsage);

export default router;
