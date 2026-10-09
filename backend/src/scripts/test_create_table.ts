// backend/src/scripts/test_create_table.ts
import mongoose from 'mongoose';
import * as tablesService from '../modules/tables/tables.service';
import { env } from '../config/env';

async function run() {
  console.log('Connecting to configured MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected!');

  try {
    const restaurantId = '6a104055418f82b4a570101f';
    const tableNumber = 'T-01';
    
    console.log('Creating table via tablesService...');
    const table = await tablesService.createTable({
      restaurantId,
      tableNumber,
      capacity: 6,
      floor: 1,
      section: 'Private',
    });
    console.log('Table created successfully:', table);
  } catch (error) {
    const message = error instanceof Error
      ? error.message.replace(env.MONGODB_URI, '[REDACTED]')
      : 'Unknown error';
    console.error('Failed to create table:', message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
