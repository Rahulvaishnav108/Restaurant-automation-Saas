import mongoose from 'mongoose';

const uri = "mongodb://[REDACTED]";

async function run() {
  await mongoose.connect(uri);
  console.log("Connected to DB!");
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("No database connection");
  }
  const users = await db.collection('users').find({}).toArray();
  console.log("Total users:", users.length);
  users.forEach(u => {
    console.log(`Email: ${u.email} | Mobile: ${u.mobile} | Role: ${u.role}`);
  });
  await mongoose.disconnect();
}

run().catch(console.error);
