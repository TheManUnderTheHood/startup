import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile // ✅ Add this import
} from '../controllers/admin.controller.js';

import { protect, restrictTo } from '../middleware/auth.middleware.js'; // ✅ Add this if not present

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// ✅ Add this route to get admin profile using token
router.get('/me', protect, restrictTo('admin'), getAdminProfile);

export default router;

