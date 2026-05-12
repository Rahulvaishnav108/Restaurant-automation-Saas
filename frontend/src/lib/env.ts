import { z } from 'zod';

/**
 * Environment variable schema to ensure all required variables are present and valid.
 * These are prefixed with VITE_ to be exposed to the frontend.
 */
const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Restaurant Automation'),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_API_URL: z.string().url().default('http://localhost:5000/api/v1'),
  VITE_SOCKET_URL: z.string().url().default('http://localhost:5000'),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_ENABLE_NOTIFICATIONS: z.string().transform((val) => val === 'true').default('true'),
  VITE_ENABLE_ANALYTICS: z.string().transform((val) => val === 'true').default('false'),
});

// Validate the environment variables
const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:', result.error.format());
  throw new Error('Invalid environment variables');
}

export const env = result.data;
