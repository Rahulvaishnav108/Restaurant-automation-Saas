import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = (() => {
  const configuredUri = process.env.MONGODB_URI;
  if (!configuredUri) {
    throw new Error('Set MONGODB_URI in the local backend environment before running this script.');
  }
  return configuredUri;
})();

async function run() {
  await mongoose.connect(uri);
  console.log("Connected to DB!");
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("No database connection");
  }
  const users = await db.collection('users').find({}).toArray();
  console.log('Total users:', users.length);
  await mongoose.disconnect();
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message.replace(uri, '[REDACTED]') : 'Unknown error';
  console.error('User query failed:', message);
  process.exitCode = 1;
});
