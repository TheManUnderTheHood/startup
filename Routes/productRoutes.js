// routes/productRoutes.js

import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ Public access
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// ✅ Protected routes: only admin or shop can manage products
router.post('/', protect, restrictTo('admin', 'shop'), createProduct);
router.put('/:id', protect, restrictTo('admin', 'shop'), updateProduct);
router.delete('/:id', protect, restrictTo('admin', 'shop'), deleteProduct);

export default router;
