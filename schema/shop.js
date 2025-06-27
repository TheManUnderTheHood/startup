import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  location: {
    street: String,
    city: String,
    pincode: String,
    geo: {
      lat: Number,
      lng: Number
    }
  },
  isVerified: { type: Boolean, default: false },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Shop', shopSchema);


