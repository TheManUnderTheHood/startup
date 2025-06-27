import express from 'express';
import Shop from '../schema/shop.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ GET all shops – Admin only (with filtering & pagination)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const {
      city,
      category,
      isVerified,
      name,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (city) filter['location.city'] = city;
    if (category) filter.category = category;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (name) filter.name = new RegExp(name, 'i');

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Shop.countDocuments(filter);

    const shops = await Shop.find(filter)
      .populate('products', 'name price category')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: shops
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST create a shop – Shop owner
router.post('/', protect, restrictTo('shop'), async (req, res) => {
  try {
    const newShop = new Shop({ ...req.body, ownerId: req.user._id });
    const saved = await newShop.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ GET a specific shop – Any logged in user
router.get('/:id', protect, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('products');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT update a shop – Only if owner
router.put('/:id', protect, restrictTo('shop'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this shop' });
    }

    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE shop – Admin only
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const deleted = await Shop.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Shop not found' });
    res.json({ message: 'Shop deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
