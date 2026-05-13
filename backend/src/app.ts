import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestId } from './middleware/requestId';
import { apiRateLimiter, authRateLimiter } from './middleware/rateLimiters';
import { apiRouter } from './modules';

const app = express();

app.disable('x-powered-by');

app.use(requestId);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
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
  }),
);
app.use(
  morgan(env.isProduction ? 'combined' : 'dev', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use('/api', apiRateLimiter);
app.use('/api/v1/auth', authRateLimiter);

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'restaurant-automation-backend',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

app.get('/ready', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ready',
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
});

app.get('/api/v1', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Restaurant Automation SaaS API',
      version: 'v1',
      docs: 'See the repository README and PRD for product scope.',
    },
  });
});

app.use('/api/v1', apiRouter);

app.get('/version', (_req, res) => {
  res.json({
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
