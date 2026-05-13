import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  logger.info('MongoDB connection established');
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB connection closed');
}
