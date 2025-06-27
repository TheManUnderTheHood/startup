import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { getAdminDashboard } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/overview', protect, restrictTo('admin'), getAdminDashboard);

export default router;
