import express from 'express';
import DeliveryAgent from '../schema/deliveryagent.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🧑‍💼 Admin: View all agents
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  res.json(await DeliveryAgent.find());
});

// 🧑‍💼 Admin: Add new agent
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  const agent = new DeliveryAgent(req.body);
  res.status(201).json(await agent.save());
});

// 🧑‍💼 Admin + agent: View a specific agent
router.get('/:id', protect, restrictTo('admin', 'delivery'), async (req, res) => {
  res.json(await DeliveryAgent.findById(req.params.id));
});

// 🧑‍💼 Admin: Update agent
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  res.json(await DeliveryAgent.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

// 🧑‍💼 Admin: Delete agent
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  res.json(await DeliveryAgent.findByIdAndDelete(req.params.id));
});


// 🚚 Agent: Get own profile
router.get('/me/profile', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const agent = await DeliveryAgent.findById(req.user._id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json({ status: 'success', data: agent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚦 Agent: Toggle availability
router.patch('/me/availability', protect, restrictTo('delivery'), async (req, res) => {
  try {
    const agent = await DeliveryAgent.findById(req.user._id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    agent.isAvailable = !agent.isAvailable;
    await agent.save();

    res.json({
      status: 'success',
      message: `Agent is now ${agent.isAvailable ? 'available' : 'unavailable'}`,
      data: agent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
