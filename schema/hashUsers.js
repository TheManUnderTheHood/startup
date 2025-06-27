import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './user.js'; // make sure path is correct!

dotenv.config(); // uses your .env for MONGO_URI

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/localShopDelivery';

const updatePasswords = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const hashed = await bcrypt.hash('123456', 10);

    const result = await User.updateMany(
      { password: 'hashed_dummy_password' },
      { $set: { password: hashed } }
    );

    console.log(`🔐 Updated ${result.modifiedCount} users`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

updatePasswords();
