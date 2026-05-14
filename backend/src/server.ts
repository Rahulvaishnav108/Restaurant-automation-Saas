// src/server.ts
// Entry point: Validate env → Connect DB → Start listening

import { env } from './config/env';   // Validates env on import — crashes if bad config
import { connectDB } from './config/db';
import { initializeCollections } from './config/initDB';
import logger from './config/logger';
import app from './app';

async function bootstrap(): Promise<void> {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Initialize collections (so they appear in Compass)
  await initializeCollections();

  // 2. Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port http://localhost:${env.PORT}`);
    logger.info(`📡 API prefix: http://localhost:${env.PORT}${env.API_PREFIX}`);
  });

  // 3. Handle unhandled rejections
  process.on('unhandledRejection', (reason: Error) => {
    logger.error('UNHANDLED REJECTION — shutting down...', { error: reason.message });
    server.close(() => process.exit(1));
  });

  // 4. Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('UNCAUGHT EXCEPTION — shutting down...', { error: error.message });
    server.close(() => process.exit(1));
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', { error: err });
  process.exit(1);
});
