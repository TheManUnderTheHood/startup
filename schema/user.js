import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  pincode: String,
  geo: {
    lat: Number,
    lng: Number
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  address: addressSchema,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
  role: {
    type: String,
    enum: ['customer', 'shop', 'agent', 'admin','delivery'],
    default: 'customer'
  },
  createdAt: { type: Date, default: Date.now }
});

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare entered password with hashed one
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
