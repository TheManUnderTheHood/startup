// ✅ Core Imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

// ✅ Route Imports
import authRoutes from '../Routes/auth.routes.js'; 
import userRoutes from '../Routes/userRoutes.js';
import adminRoutes from '../Routes/adminRoutes.js'; // admin login/register
import adminDashboardRoutes from '../Routes/adminDashboardRoutes.js'; // admin stats
import shopRoutes from '../Routes/shopRoutes.js';
import productRoutes from '../Routes/productRoutes.js';
import orderRoutes from '../Routes/orderRoutes.js';
import deliveryAgentRoutes from '../Routes/deliveryAgentRoutes.js';

// ✅ Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/localShopDelivery';

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🚀 API is working!');
});

// ✅ Mount Routes
app.use('/api/auth', authRoutes);                 // User login/register
app.use('/api/users', userRoutes);                // User listing, filtering
app.use('/api/admin', adminRoutes);               // Admin login/register
app.use('/api/admin', adminDashboardRoutes);      // Admin stats/overview
app.use('/api/shops', shopRoutes);                // Shop creation, listing
app.use('/api/products', productRoutes);          // Product routes + filters
app.use('/api/orders', orderRoutes);              // Order lifecycle
app.use('/api/delivery', deliveryAgentRoutes);    // Delivery agent profile, CRUD

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
