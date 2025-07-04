import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  pincode: String,
  geo: { lat: Number, lng: Number }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  password: { type: String, required: true, select: false },
  address: addressSchema,
  
  role: {
    type: String,
    enum: ['customer', 'shop', 'delivery', 'admin'],
    default: 'customer'
  },
  
  // -- Delivery-agent specific fields --
  isAvailable: {
    type: Boolean,
    default: function() { return this.role === 'delivery' ? true : undefined; }
  },
  vehicleDetails: { 
    type: String,
    default: function() { return this.role === 'delivery' ? '' : undefined; }
  },

  // -- Shop-owner specific fields --
  // This links a user of role 'shop' to the single shop they own.
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    default: function() { return this.role === 'shop' ? null : undefined; }
  }

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);