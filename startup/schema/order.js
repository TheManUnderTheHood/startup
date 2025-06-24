const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  deliveryAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent' },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  deliveryAddress: {
    street: String,
    city: String,
    pincode: String,
    geo: {
      lat: Number,
      lng: Number
    }
  },
  paymentMethod: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

