import express from 'express';
import User from '../schema/user.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🔐 Admin only: Get all users
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 🔐 Admin only: Create user manually (rarely needed)
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

// 🔐 Any logged-in user: Get own profile
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// 🔐 Any logged-in user: Get specific user (admin only)
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// 🔐 User can update self; admin can update anyone
router.put('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// 🔐 Only admin can delete users
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

export default router;
