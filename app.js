import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // <-- Import cookie-parser
import session from 'express-session';    // <-- Import express-session
import MongoStore from 'connect-mongo';   // <-- Import connect-mongo

// Route Imports
import authRoutes from './Routes/auth.routes.js';
import userRoutes from './Routes/user.routes.js';
import adminRoutes from './Routes/admin.routes.js';
import shopRoutes from './Routes/shop.routes.js';
import productRoutes from './Routes/product.routes.js';
import orderRoutes from './Routes/order.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
// Enable CORS for frontend interaction
app.use(cors({
  origin: true, // You can restrict this to your frontend URL in production
  credentials: true, // IMPORTANT: Allows cookies to be sent from the browser
}));

app.use(express.json());
app.use(cookieParser()); // <-- Use cookie-parser

// Check if MONGO_URI is loaded
if (!MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is not defined. Please check your .env file.');
  process.exit(1);
}

// Session Middleware Configuration
app.use(
  session({
    secret: process.env.JWT_SECRET, // Reuse JWT secret for session signing
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: 'sessions', // Name of the collection to store sessions
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (same as JWT)
      httpOnly: true, // Prevents client-side JS from accessing the cookie (security)
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    },
  })
);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => res.send('🚀 API is working!'));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});