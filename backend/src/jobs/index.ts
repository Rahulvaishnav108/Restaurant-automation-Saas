import { startExpireSessionsJob } from './expireSessions.job';
import { logger } from '../config/logger';

/**
 * Orchestrates and starts all background jobs for the SaaS backend cleanly.
 * Called once during server boot.
 */
export function startBackgroundJobs(): void {
  try {
    startExpireSessionsJob();
    logger.info('All background cron jobs successfully initialized');
  } catch (error) {
    logger.error('Failed to initialize background cron jobs', { error });
  }
}
