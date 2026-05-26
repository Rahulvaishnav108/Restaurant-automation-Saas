import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestId } from './middleware/requestId';
import { apiRateLimiter } from './middleware/rateLimiters';
import { apiRouter } from './modules';
import billingRoutes from './modules/billing/billing.routes';
import customerRequestsRoutes from './modules/notifications/customerRequests.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import tableSessionRoutes from './modules/tableSessions/tableSessions.routes';
import tableRoutes from './modules/tables/tables.routes';

const app = express();

app.disable('x-powered-by');

if (env.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

app.use(requestId);

if (env.HELMET_ENABLED) {
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin denied'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use(
  morgan(env.isProduction ? 'combined' : 'dev', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
    skip: () => !env.ENABLE_REQUEST_LOGS,
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(mongoSanitize());
app.use(`/${env.UPLOAD_PATH}`, express.static(path.resolve(process.cwd(), env.UPLOAD_PATH)));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Restaurant Automation SaaS API',
      version: 'v1',
      docs: env.API_PREFIX,
      health: '/health',
      ready: '/ready',
    },
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'restaurant-automation-backend',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
});

app.get('/ready', (_req, res) => {
  if (mongoose.connection.readyState === 1 || env.allowNoDb) {
    res.status(200).json({
      success: true,
      data: {
        status: 'ready',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'skipped',
        uptimeSeconds: Math.round(process.uptime()),
      },
    });
    return;
  }

  res.status(503).json({
    success: false,
    error: {
      code: 'SERVICE_UNAVAILABLE',
      message: 'Database not ready',
    },
  });
});

app.use('/api', apiRateLimiter);

app.get(env.API_PREFIX, (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Restaurant Automation SaaS API',
      version: 'v1',
      docs: 'See the repository README and PRD for product scope.',
    },
  });
});

app.use(`${env.API_PREFIX}/tables`, tableRoutes);
app.use(`${env.API_PREFIX}/sessions`, tableSessionRoutes);
app.use(`${env.API_PREFIX}/customer/requests`, customerRequestsRoutes);
app.use(`${env.API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${env.API_PREFIX}`, billingRoutes);
app.use(env.API_PREFIX, apiRouter);

app.get('/version', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      version: 'v1',
      releaseDate: '2026-05-11',
      contract: 'restaurant_automation_final_prd.md',
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
