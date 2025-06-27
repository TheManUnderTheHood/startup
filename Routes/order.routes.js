import express from 'express';
import { createOrder, updateOrderStatus, trackOrder } from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🛒 Create an order (customers only)
router.post('/', protect, restrictTo('customer'), createOrder);

// 🚚 Update order status (agents only)
router.put('/:id/status', protect, restrictTo('agent'), updateOrderStatus);

// 📍 Track order (customers only)
router.get('/:id/track', protect, restrictTo('customer'), trackOrder);

export default router;
