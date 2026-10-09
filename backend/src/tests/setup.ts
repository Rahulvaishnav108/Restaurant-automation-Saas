// src/tests/setup.ts
process.env.NODE_ENV = 'test';
process.env.SMTP_HOST = 'localhost';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'testuser';
process.env.SMTP_PASS = '';
process.env.SMTP_FROM = 'noreply@example.com';
process.env.CLIENT_URL = 'http://localhost:3000';
const { env } = require('../config/env') as typeof import('../config/env');
const mongoose = require('mongoose') as typeof import('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server') as typeof import('mongodb-memory-server');
const { connectDB, disconnectDB } = require('../config/db') as typeof import('../config/db');

// Allow enough time for first-run mongodb-memory-server binary download on fresh machines/CI.
jest.setTimeout(300000);

// Ensure we are in test mode and use the test database
process.env.NODE_ENV = 'test';
env.NODE_ENV = 'test';

let mongoServer: import('mongodb-memory-server').MongoMemoryServer | null = null;

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
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  await disconnectDB();
  await mongoose.disconnect();
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