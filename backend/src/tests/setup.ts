// src/tests/setup.ts
import { env } from '../config/env';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../config/db';

// Allow enough time for first-run mongodb-memory-server binary download on fresh machines/CI.
jest.setTimeout(300000);

// Ensure we are in test mode and use the test database
process.env.NODE_ENV = 'test';
env.NODE_ENV = 'test';

let mongoServer: MongoMemoryServer | null = null;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'RestaurantAutomationTest',
    },
  });

  env.MONGODB_URI = mongoServer.getUri();
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
  if (mongoServer) {
    await mongoServer.stop();
  }
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

