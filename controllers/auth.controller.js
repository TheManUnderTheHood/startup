import jwt from 'jsonwebtoken';
import User from '../schema/user.js';

// 🔐 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 📝 Register New User
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔍 Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 🛠️ Create user (assumes pre-save hash in schema)
    const user = await User.create({ name, email, password, role });

    // ✅ Success
    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Registration error:", err); // 👀 Log the error
    res.status(500).json({
      error: 'Registration failed',
      message: err.message // 🧾 Send actual error message
    });
  }
};

// 🔑 Login Existing User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ✅ Success
    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err); // 👀 Log the error
    res.status(500).json({
      error: 'Login failed',
      message: err.message
    });
  }
};
