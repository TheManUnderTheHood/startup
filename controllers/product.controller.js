import Product from '../schema/product.js';

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      shopId: req.user.id  // 🔐 Attach logged-in shop’s ID
    });

    res.status(201).json({ status: 'success', data: product });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};


// ✅ Get All Products (with filters and pagination)
export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      shopId,
      minPrice,
      maxPrice,
      name,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (shopId) filter.shopId = shopId;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (name) filter.name = new RegExp(name, 'i');

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate('shopId', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shopId');
    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: updatedProduct });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }
    res.status(204).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
