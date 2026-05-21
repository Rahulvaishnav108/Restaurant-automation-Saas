import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { analyticsQuerySchema } from './analytics.schema';
import {
  getRevenueAnalytics,
  getPeakHoursAnalytics,
  getRepeatCustomersAnalytics,
  getKitchenPerformanceAnalytics,
  getTableUtilizationAnalytics
} from './analytics.controller';

const router = Router();

router.get('/overview', validate({ query: analyticsQuerySchema }), getRevenueAnalytics);
router.get('/peak-hours', validate({ query: analyticsQuerySchema }), getPeakHoursAnalytics);
router.get('/repeat-customers', validate({ query: analyticsQuerySchema }), getRepeatCustomersAnalytics);
router.get('/kitchen', validate({ query: analyticsQuerySchema }), getKitchenPerformanceAnalytics);
router.get('/tables', getTableUtilizationAnalytics);

export default router;
