import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1).default('mongodb://[REDACTED]'),
  ALLOW_NO_DB: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  JWT_SECRET: z.string().min(8).default('development-secret'),
  REFRESH_TOKEN_SECRET: z.string().min(8).default('development-refresh-secret'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(8).default('development-cookie-secret'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(500),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(50),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  CLIENT_URL: z.string().optional(),
  CORS_ORIGINS: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const origins = parsedEnv.data.CORS_ORIGINS ?? parsedEnv.data.CORS_ORIGIN;

export const env = {
  ...parsedEnv.data,
  allowNoDb: parsedEnv.data.ALLOW_NO_DB ?? parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  corsOrigins: origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type AppEnv = typeof env;
