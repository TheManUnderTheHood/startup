import Shop from '../schema/shop.js';

// Create new shop
export const createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json({ status: 'success', data: shop });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Get all shops
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('ownerId').populate('products');
    res.status(200).json({ status: 'success', data: shops });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get single shop by ID
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('ownerId').populate('products');
    if (!shop) return res.status(404).json({ status: 'fail', message: 'Shop not found' });

    res.status(200).json({ status: 'success', data: shop });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Update shop
export const updateShop = async (req, res) => {
  try {
    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ status: 'fail', message: 'Shop not found' });

    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Delete shop
export const deleteShop = async (req, res) => {
  try {
    const deleted = await Shop.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 'fail', message: 'Shop not found' });

    res.status(204).json({ status: 'success', message: 'Shop deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
