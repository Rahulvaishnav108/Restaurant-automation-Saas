import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { analyticsQuerySchema } from './analytics.schema';
import {
  getCustomerRetentionAnalytics,
  getOverviewAnalytics,
  getRevenueAnalytics,
  getPeakHoursAnalytics,
  getRepeatCustomersAnalytics,
  getKitchenPerformanceAnalytics,
  getTableUtilizationAnalytics,
} from './analytics.controller';

const router = Router();

router.get('/revenue', validate({ query: analyticsQuerySchema }), getRevenueAnalytics);
router.get('/peak-hours', validate({ query: analyticsQuerySchema }), getPeakHoursAnalytics);
router.get('/repeat-customers', validate({ query: analyticsQuerySchema }), getRepeatCustomersAnalytics);
router.get('/kitchen', validate({ query: analyticsQuerySchema }), getKitchenPerformanceAnalytics);
router.get('/table-utilization', validate({ query: analyticsQuerySchema }), getTableUtilizationAnalytics);
router.get('/customer-retention', validate({ query: analyticsQuerySchema }), getCustomerRetentionAnalytics);

// Legacy aliases retained to avoid breaking existing integrations while the team shifts to the updated PDF contract.
router.get('/overview', validate({ query: analyticsQuerySchema }), getOverviewAnalytics);
router.get('/tables', validate({ query: analyticsQuerySchema }), getTableUtilizationAnalytics);

export default router;
