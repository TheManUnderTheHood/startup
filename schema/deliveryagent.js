import mongoose from 'mongoose';

const deliveryAgentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicleDetails: String,
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('DeliveryAgent', deliveryAgentSchema);
