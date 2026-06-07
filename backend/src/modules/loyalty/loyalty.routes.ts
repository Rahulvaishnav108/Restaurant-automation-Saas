import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { createLoyaltyRuleController, listLoyaltyRulesController } from './loyalty.controller';
import { createLoyaltyRuleBodySchema } from './loyalty.schema';

const router = Router();

router.get('/rules', listLoyaltyRulesController);
router.post('/rules', validate({ body: createLoyaltyRuleBodySchema }), createLoyaltyRuleController);

export default router;
