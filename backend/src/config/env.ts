import dotenv from 'dotenv';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const blankAsUndefined = (value: unknown) => (value === '' ? undefined : value);
const optionalSecret = z.preprocess(blankAsUndefined, z.string().min(32).optional());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  API_PREFIX: z.string().default('/api/v1'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().optional(),
  MONGODB_URI: z.preprocess(blankAsUndefined, z.string().min(1).optional()),
  MONGODB_CONNECT_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  ALLOW_NO_DB: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  SEED_ON_STARTUP: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  JWT_SECRET: optionalSecret,
  REFRESH_TOKEN_SECRET: optionalSecret,
  JWT_REFRESH_SECRET: optionalSecret,
  JWT_ACCESS_EXPIRY: z.string().optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_EXPIRY: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().optional(),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),
  COOKIE_SECRET: optionalSecret,
  COOKIE_DOMAIN: z.string().default('localhost'),
  ACCESS_COOKIE_NAME: z.string().default('ra_access_token'),
  REFRESH_COOKIE_NAME: z.string().default('ra_refresh_token'),
  SESSION_EXPIRES_IN_MINUTES: z.coerce.number().int().positive().default(120),
  QR_SESSION_EXPIRES_IN_MINUTES: z.coerce.number().int().positive().default(90),
  TABLE_SESSION_TOKEN_LENGTH: z.coerce.number().int().positive().default(64),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().optional(),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
  SESSION_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(5),
  SESSION_IDLE_TIMEOUT_MINUTES: z.coerce.number().int().positive().default(20),
  SOCKET_CORS_ORIGIN: z.string().default('http://localhost:5173'),
  UPLOAD_PROVIDER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  UPLOAD_PATH: z.string().default('uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().default(10),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  HELMET_ENABLED: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(true),
  TRUST_PROXY: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(false),
  SENTRY_DSN: z.string().optional(),
  REDIS_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  ENABLE_SWAGGER: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(true),
  ENABLE_SOCKET_LOGS: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(true),
  ENABLE_REQUEST_LOGS: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(true),
  DOCKER_ENV: z.string().optional(),
  SUPER_ADMIN_EMAIL: z.preprocess(blankAsUndefined, z.string().email().optional()),
  SUPER_ADMIN_PASSWORD: z.preprocess(blankAsUndefined, z.string().min(12).optional()),
  DEV_SEED_PASSWORD: z.preprocess(blankAsUndefined, z.string().min(12).optional()),
  CRON_SALES_REPORT_ENABLED: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(true),
  CRON_SALES_REPORT_TIME: z.string().default('5 0 * * *'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const rawEnv = parsedEnv.data;
const isProduction = rawEnv.NODE_ENV === 'production';
const hasProductionMongoUri =
  typeof rawEnv.MONGODB_URI === 'string' && /^mongodb(?:\+srv)?:\/\//i.test(rawEnv.MONGODB_URI);
const refreshSecretInput = rawEnv.REFRESH_TOKEN_SECRET ?? rawEnv.JWT_REFRESH_SECRET;
const missingProductionSettings = [
  !hasProductionMongoUri && 'MONGODB_URI',
  !rawEnv.JWT_SECRET && 'JWT_SECRET',
  !refreshSecretInput && 'REFRESH_TOKEN_SECRET or JWT_REFRESH_SECRET',
  !rawEnv.COOKIE_SECRET && 'COOKIE_SECRET',
  !rawEnv.SMTP_HOST && 'SMTP_HOST',
  !rawEnv.SMTP_USER && 'SMTP_USER',
  !rawEnv.SMTP_PASS && 'SMTP_PASS',
  !rawEnv.SMTP_FROM && 'SMTP_FROM',
  rawEnv.SEED_ON_STARTUP && isProduction && 'SEED_ON_STARTUP=false',
].filter((setting): setting is string => Boolean(setting));

if (isProduction && missingProductionSettings.length > 0) {
  console.error(
    `Invalid production configuration: set ${missingProductionSettings.join(', ')}.`,
  );
  process.exit(1);
}

const makeDevelopmentSecret = () => randomBytes(32).toString('hex');
const jwtSecret = rawEnv.JWT_SECRET ?? makeDevelopmentSecret();
const jwtRefreshSecret = refreshSecretInput ?? makeDevelopmentSecret();
const cookieSecret = rawEnv.COOKIE_SECRET ?? makeDevelopmentSecret();

if (isProduction && new Set([jwtSecret, jwtRefreshSecret, cookieSecret]).size !== 3) {
  console.error('JWT_SECRET, refresh secret, and COOKIE_SECRET must all be different.');
  process.exit(1);
}

const origins = rawEnv.CORS_ORIGINS ?? rawEnv.CORS_ORIGIN;
const jwtAccessExpiry = rawEnv.JWT_ACCESS_EXPIRY ?? rawEnv.JWT_ACCESS_EXPIRES_IN ?? '15m';
const jwtRefreshExpiry = rawEnv.JWT_REFRESH_EXPIRY ?? rawEnv.JWT_REFRESH_EXPIRES_IN ?? '7d';
const rateLimitMax = rawEnv.RATE_LIMIT_MAX ?? rawEnv.RATE_LIMIT_MAX_REQUESTS ?? 100;

export const env = {
  ...rawEnv,
  MONGODB_URI: rawEnv.MONGODB_URI ?? 'mongodb://[REDACTED]',
  JWT_SECRET: jwtSecret,
  COOKIE_SECRET: cookieSecret,
  REFRESH_TOKEN_SECRET: jwtRefreshSecret,
  JWT_REFRESH_SECRET: jwtRefreshSecret,
  JWT_ACCESS_EXPIRY: jwtAccessExpiry,
  JWT_ACCESS_EXPIRES_IN: jwtAccessExpiry,
  JWT_REFRESH_EXPIRY: jwtRefreshExpiry,
  JWT_REFRESH_EXPIRES_IN: jwtRefreshExpiry,
  RATE_LIMIT_MAX: rateLimitMax,
  RATE_LIMIT_MAX_REQUESTS: rateLimitMax,
  allowNoDb: rawEnv.ALLOW_NO_DB ?? false,
  seedOnStartup: rawEnv.SEED_ON_STARTUP ?? rawEnv.NODE_ENV === 'development',
  isProduction: rawEnv.NODE_ENV === 'production',
  isDevelopment: rawEnv.NODE_ENV === 'development',
  corsOrigins: origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type AppEnv = typeof env;
export type Env = typeof env;