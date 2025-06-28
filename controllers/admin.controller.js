import Admin from '../schema/admin.js';
import User from '../schema/user.js';
import Shop from '../schema/shop.js';
import Order from '../schema/order.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 🔐 JWT Token Generator
const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// ✅ Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      token: generateToken(admin),
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', message: err.message });
  }
};

// ✅ Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password (admin not found)' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password (wrong password)' });
    }

    res.json({
      token: generateToken(admin),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', message: err.message });
  }
};

// ✅ Admin Dashboard Overview
export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      customerCount,
      shopCount,
      deliveryCount,
      adminCount,
      totalShops,
      verifiedShops,
      unverifiedShops,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'shop' }),
      User.countDocuments({ role: 'delivery' }),
      User.countDocuments({ role: 'admin' }),
      Shop.countDocuments(),
      Shop.countDocuments({ isVerified: true }),
      Shop.countDocuments({ isVerified: false }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        usersByRole: {
          customer: customerCount,
          shop: shopCount,
          delivery: deliveryCount,
          admin: adminCount
        },
        totalShops,
        verifiedShops,
        unverifiedShops,
        orderStats: {
          total: totalOrders,
          delivered: deliveredOrders,
          pending: pendingOrders,
          cancelled: cancelledOrders
        },
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
// ✅ Get Admin Profile (for /api/admin/me)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
