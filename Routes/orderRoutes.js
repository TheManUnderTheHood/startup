import express from 'express';
import {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getMyOrders,
  getAssignedOrders,
  trackOrder
} from '../controllers/order.controller.js';

import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🛒 User: place a new order
router.post('/', protect, restrictTo('user'), createOrder);

// 📄 User: get their own orders
router.get('/my', protect, restrictTo('user'), getMyOrders);

// 🚚 Delivery agent: get assigned orders
router.get('/assigned', protect, restrictTo('delivery'), getAssignedOrders);

// 🔄 Admin & delivery: update order status
router.put('/:id/status', protect, restrictTo('admin', 'delivery'), updateOrderStatus);

// 📍 Admin: get all orders
router.get('/', protect, restrictTo('admin'), getAllOrders);

// 📦 Track a specific order
router.get('/:id/track', protect, restrictTo('user', 'delivery', 'admin'), trackOrder);

export default router;
