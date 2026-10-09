// backend/src/scripts/seed_more_tables.ts
import mongoose from 'mongoose';
import * as tablesService from '../modules/tables/tables.service';
import { env } from '../config/env';

const tablesToSeed = [
  { tableNumber: 'T-02', capacity: 4, floor: 1, section: 'Indoor' },
  { tableNumber: 'T-03', capacity: 2, floor: 1, section: 'Bar' },
  { tableNumber: 'T-04', capacity: 8, floor: 2, section: 'Private' },
  { tableNumber: 'T-05', capacity: 4, floor: 2, section: 'Indoor' },
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected!');

  const restaurantId = '6a104055418f82b4a570101f';

  for (const t of tablesToSeed) {
    try {
      console.log(`Creating table ${t.tableNumber}...`);
      const table = await tablesService.createTable({
        restaurantId,
        tableNumber: t.tableNumber,
        capacity: t.capacity,
        floor: t.floor,
        section: t.section,
      });
      console.log(`Table ${t.tableNumber} created:`, table._id);
    } catch (err: any) {
      const message = String(err?.message ?? 'Unknown error').replace(env.MONGODB_URI, '[REDACTED]');
      console.error(`Failed to create table ${t.tableNumber}:`, message);
    }
  }

  await mongoose.disconnect();
  console.log('Done!');
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message.replace(env.MONGODB_URI, '[REDACTED]') : 'Unknown error';
  console.error('Table seeding failed:', message);
  process.exitCode = 1;
});
