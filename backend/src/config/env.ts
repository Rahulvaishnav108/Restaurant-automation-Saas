// src/config/env.ts
// Zod-validated environment variables — app crashes on startup if misconfigured

import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env before validation
dotenv.config();

const envSchema = z.object({
  // ── Server ──────────────────────────────────────────────────────────
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // ── Database ────────────────────────────────────────────────────────
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // ── JWT ─────────────────────────────────────────────────────────────
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('12'),

  // ── Session & Cookie ────────────────────────────────────────────────
  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET must be at least 32 chars'),
  COOKIE_DOMAIN: z.string().default('localhost'),
  ACCESS_COOKIE_NAME: z.string().default('ra_access_token'),
  REFRESH_COOKIE_NAME: z.string().default('ra_refresh_token'),
  SESSION_EXPIRES_IN_MINUTES: z.string().transform(Number).default('120'),

  // ── QR Session Security ─────────────────────────────────────────────
  QR_SESSION_EXPIRES_IN_MINUTES: z.string().transform(Number).default('90'),
  TABLE_SESSION_TOKEN_LENGTH: z.string().transform(Number).default('64'),

  // ── Rate Limiting ───────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('10'),
  SESSION_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('5'),

  // ── Session Idle Timeout ────────────────────────────────────────────
  SESSION_IDLE_TIMEOUT_MINUTES: z.string().transform(Number).default('20'),

  // ── Socket.IO ───────────────────────────────────────────────────────
  SOCKET_CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // ── File Uploads ────────────────────────────────────────────────────
  UPLOAD_PROVIDER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  UPLOAD_PATH: z.string().default('uploads'),
  MAX_FILE_SIZE_MB: z.string().transform(Number).default('10'),

  // ── Email / SMTP ────────────────────────────────────────────────────
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  // ── Logging ─────────────────────────────────────────────────────────
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),

  // ── Security ────────────────────────────────────────────────────────
  HELMET_ENABLED: z.string().transform((v) => v === 'true').default('true'),
  TRUST_PROXY: z.string().transform((v) => v === 'true').default('false'),

  // ── Monitoring ──────────────────────────────────────────────────────
  SENTRY_DSN: z.string().optional(),

  // ── Redis ───────────────────────────────────────────────────────────
  REDIS_URL: z.string().optional(),

  // ── Payment ─────────────────────────────────────────────────────────
  STRIPE_SECRET_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  // ── Feature Flags ───────────────────────────────────────────────────
  ENABLE_SWAGGER: z.string().transform((v) => v === 'true').default('true'),
  ENABLE_SOCKET_LOGS: z.string().transform((v) => v === 'true').default('true'),
  ENABLE_REQUEST_LOGS: z.string().transform((v) => v === 'true').default('true'),

  // ── Docker ──────────────────────────────────────────────────────────
  DOCKER_ENV: z.string().optional(),

  // ── Super Admin ─────────────────────────────────────────────────────
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  SUPER_ADMIN_PASSWORD: z.string().min(8).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1); // Crash immediately — never run with bad config
}

export const env = parsed.data;

// Type export for use in other files
export type Env = z.infer<typeof envSchema>;
