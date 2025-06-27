import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  name: String,
  description: String,
  price: Number,
  quantityAvailable: Number,
  category: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Product', productSchema);
