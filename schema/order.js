import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: Number,
  price: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  deliveryAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Agent is a User
  products: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    pincode: String,
    geo: { lat: Number, lng: Number }
  },
  paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);