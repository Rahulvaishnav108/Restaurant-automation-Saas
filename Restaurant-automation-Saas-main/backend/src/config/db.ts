// src/config/db.ts
// MongoDB connection with Mongoose — graceful shutdown support

import mongoose from 'mongoose';
import { env } from './env';
import logger from './logger';

/**
 * Connect to MongoDB Atlas / local instance.
 * Exits process on initial connection failure (fail-fast).
 */
export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      // Mongoose 8 uses the new driver defaults — no deprecated options needed
    });

    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', { error });
    process.exit(1); // Crash on initial connection failure
  }

  // Connection event listeners
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', { error: err.message });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('🔄 MongoDB reconnected');
  });
}

/**
 * Gracefully close MongoDB connection.
 * Called on SIGINT / SIGTERM for clean shutdown.
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', { error });
  }
}

// Graceful shutdown handlers
const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received — shutting down gracefully...`);
  await disconnectDB();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
