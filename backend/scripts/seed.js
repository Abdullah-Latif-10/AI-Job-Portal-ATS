require('dotenv').config();
const mongoose = require('mongoose');
const seedDB = require('../config/seed');

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Copy .env.example to .env and try again.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${process.env.MONGO_URI}`);
    process.env.SEED_DEMO = process.env.SEED_DEMO || 'true';
    await seedDB();
    console.log('Seed script finished.');
    process.exit(0);
  } catch (error) {
    console.error(`Seed script failed: ${error.message}`);
    process.exit(1);
  }
};

run();
