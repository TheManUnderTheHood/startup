// schema/seed.js (corrected paths for being inside schema/)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Shop from './shop.js';
import Order from './order.js';
import DeliveryAgent from './deliveryagent.js';
import User from './user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ .env is also in schema/, so just use:
dotenv.config({ path: path.resolve(__dirname, '.env') });

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
});
console.log('✅ MongoDB Connected');

// ✅ Get real user
const user = await User.findOne({ role: 'customer' });
if (!user) {
  console.error('❌ No customer found in DB');
  process.exit(1);
}
console.log(`🔗 Linking orders to user: ${user.email}`);

// Shops
const shops = [
  { name: 'Fresh Mart', address: 'Main Street', city: 'Delhi', category: 'Grocery' },
  { name: 'Quick Eat', address: 'Sector 5', city: 'Mumbai', category: 'Food' },
  { name: 'Style Hub', address: 'Ring Road', city: 'Bangalore', category: 'Clothing' },
  { name: 'Health First', address: 'Green Avenue', city: 'Pune', category: 'Pharmacy' },
  { name: 'Tech Point', address: 'IT Park', city: 'Hyderabad', category: 'Electronics' }
];

// Delivery agents
const agents = [
  { name: 'Ravi Kumar', phone: '9876543210' },
  { name: 'Anjali Sharma', phone: '9123456789' },
  { name: 'Amit Joshi', phone: '9988776655' }
];

// Orders
const orders = [
  { userId: user._id, items: ['item1', 'item2'], totalAmount: 150, status: 'pending' },
  { userId: user._id, items: ['item3'], totalAmount: 90, status: 'accepted' },
  { userId: user._id, items: ['item4', 'item5', 'item6'], totalAmount: 350, status: 'delivered' }
];


// Clear and insert
await Shop.deleteMany();
await Order.deleteMany();
await DeliveryAgent.deleteMany();

await Shop.insertMany(shops);
await DeliveryAgent.insertMany(agents);
await Order.insertMany(orders);

console.log('✅ Sample data inserted');
process.exit();
