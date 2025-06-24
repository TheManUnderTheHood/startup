const mongoose = require('mongoose');

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
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

