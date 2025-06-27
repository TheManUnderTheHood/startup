import Order from '../schema/order.js';
import DeliveryAgent from '../schema/deliveryagent.js';

// ✅ Place a new order (User)
export const createOrder = async (req, res) => {
  try {
    const { shopId, products, deliveryAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    // 🔢 Calculate total amount
    const totalAmount = products.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // 🔍 Find an available delivery agent
    const availableAgent = await DeliveryAgent.findOne({ isAvailable: true });
    if (!availableAgent) {
      return res.status(400).json({ message: 'No delivery agents available at the moment' });
    }

    // 📦 Create order
    const newOrder = new Order({
      userId,
      shopId,
      deliveryAgentId: availableAgent._id,
      products,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'pending'
    });

    await newOrder.save();

    // 🚚 Mark agent as unavailable + assign order
    availableAgent.isAvailable = false;
    availableAgent.assignedOrders.push(newOrder._id);
    await availableAgent.save();

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  }
};

// ✅ Update order status (Admin/Delivery)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // 🔒 Delivery agent can only update their own orders
    if (req.user.role === 'delivery') {
      if (!order.deliveryAgentId || order.deliveryAgentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not your assigned order' });
      }
    }

    order.status = status;
    await order.save();

    // ✅ Mark agent available if delivered
    if (status === 'delivered') {
      const agent = await DeliveryAgent.findById(order.deliveryAgentId);
      if (agent) {
        agent.isAvailable = true;
        await agent.save();
      }
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// ✅ Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      shopId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (shopId) query.shopId = shopId;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('shopId', 'name')
      .populate('deliveryAgentId', 'name phone')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


// ✅ Get current user’s orders (User)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('shopId', 'name')
      .populate('deliveryAgentId', 'name');
    res.status(200).json({ status: 'success', data: orders });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Get delivery agent’s assigned orders
export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryAgentId: req.user._id })
      .populate('shopId', 'name')
      .populate('userId', 'name');
    res.status(200).json({ status: 'success', data: orders });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Track a single order (User/Delivery/Admin)
export const trackOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email')
      .populate('shopId', 'name location')
      .populate('deliveryAgentId', 'name phone location');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔒 Only user, agent, or admin can track
    if (
      req.user.role === 'user' && order.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized to track this order' });
    }

    if (
      req.user.role === 'delivery' && order.deliveryAgentId?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not your assigned order' });
    }

    res.json({
      status: order.status,
      totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress,
      agent: order.deliveryAgentId ? {
        name: order.deliveryAgentId.name,
        phone: order.deliveryAgentId.phone,
        location: order.deliveryAgentId.location
      } : null,
      placedAt: order.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to track order' });
  }
};
