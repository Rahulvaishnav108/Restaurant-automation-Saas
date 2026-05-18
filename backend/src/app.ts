// src/app.ts
// Express app — full middleware stack + route mounts
// Middleware order matters — see instruction.md Section 4

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import { env } from './config/env';
import { requestId } from './middleware/requestId';
import { globalLimiter } from './middleware/rateLimiters';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import tableRoutes from './modules/tables/tables.routes';
import tableSessionRoutes from './modules/tableSessions/tableSessions.routes';
import orderRoutes from './modules/orders/orders.routes';
import menuRoutes from './modules/menu/menu.routes';
import cartRoutes from './modules/cart/cart.routes';

const app = express();

// ── 1. Request ID (for log correlation) ───────────────────────────────
app.use(requestId);

// ── 2. Security headers ──────────────────────────────────────────────
if (env.HELMET_ENABLED) {
  app.use(helmet());
}

// ── 3. CORS — explicit origin list, never '*' with credentials ────────
app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// ── 4. Body parsing (limit body size to prevent payload attacks) ──────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── 5. Cookie parser (for refresh token HttpOnly cookie) ──────────────
app.use(cookieParser(env.COOKIE_SECRET));

// ── 6. NoSQL injection prevention ─────────────────────────────────────
app.use(mongoSanitize());

// ── 7. HTTP request logging (dev only) ────────────────────────────────
if (env.NODE_ENV === 'development' && env.ENABLE_REQUEST_LOGS) {
  app.use(morgan('dev'));
}

// ── Root route ────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Restaurant Automation API',
      version: '1.0.0',
      status: 'running',
      docs: `${env.API_PREFIX}`,
      health: '/health',
      ready: '/ready',
    },
  });
});

// ── Health & Readiness (outside rate limits) ──────────────────────────

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

app.get('/ready', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({
      success: true,
      data: {
        status: 'READY',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } else {
    res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database not ready',
      },
    });
  }
});

// ── 8. Global rate limit on API routes ────────────────────────────────
app.use('/api', globalLimiter);

// ── 9. API Routes ─────────────────────────────────────────────────────
app.get(`${env.API_PREFIX}`, (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Restaurant Automation API v1',
      modules: {
        auth: '/auth',
        users: '/users',
        tables: '/tables',
        sessions: '/sessions',
        orders: {
          customer: '/customer/orders',
          kitchen: '/kitchen/orders',
          staff: '/staff/orders',
        },
        menu: {
          customer: '/customer/menu',
          public: '/public/menu',
          admin: '/admin/menu',
        },
        cart: '/customer/cart',
      },
    },
  });
});

app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/users`, userRoutes);
app.use(`${env.API_PREFIX}/tables`, tableRoutes);
app.use(`${env.API_PREFIX}/sessions`, tableSessionRoutes);
app.use(`${env.API_PREFIX}`, orderRoutes);
app.use(`${env.API_PREFIX}`, menuRoutes);
app.use(`${env.API_PREFIX}/customer/cart`, cartRoutes);

// ── 10. 404 handler for unknown routes ────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// ── 11. Central error handler (always last) ───────────────────────────
app.use(errorHandler);

export default app;
