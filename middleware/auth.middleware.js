import jwt from 'jsonwebtoken';
import User from '../schema/user.js';
import Admin from '../schema/admin.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id);
      if (req.user) {
        req.user.role = 'admin';
        req.user.id = req.user._id.toString(); // ✅ normalize ID
      }
    } else {
      req.user = await User.findById(decoded.id);
      if (req.user) {
        req.user.id = req.user._id.toString(); // ✅ normalize ID
      }
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};
