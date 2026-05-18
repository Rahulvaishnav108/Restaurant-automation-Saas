// src/tests/setup.ts
import { env } from '../config/env';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';

// Set a longer timeout for tests running against a remote DB instance
jest.setTimeout(30000);

// Ensure we are in test mode and use the test database
process.env.NODE_ENV = 'test';
env.NODE_ENV = 'test';

if (env.MONGODB_URI) {
  // Replace the db name with RestaurantAutomationTest to avoid polluting development data
  env.MONGODB_URI = env.MONGODB_URI.replace(
    '/RestaurantAutomation',
    '/RestaurantAutomationTest'
  );
} else {
  env.MONGODB_URI = 'mongodb://[REDACTED]';
}

beforeAll(async () => {
  // Connect to the test database
  await connectDB();
});

afterAll(async () => {
  // Clean up and disconnect
  await disconnectDB();
});

afterEach(async () => {
  // Clear collections to keep tests isolated
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

