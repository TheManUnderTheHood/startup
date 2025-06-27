// schema/importUsers.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 🧠 Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ LOAD .env FROM EXACT LOCATION
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 MONGO_URI:', process.env.MONGO_URI);

// rest of your code
import users from './sampleuser.js';
import User from './user.js';

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return User.deleteMany();
  })
  .then(() => User.insertMany(users))
  .then(() => {
    console.log('✅ Sample users inserted successfully.');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error inserting users:', err);
    mongoose.disconnect();
  });
