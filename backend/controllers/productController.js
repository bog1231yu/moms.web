const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const { category, sortBy, search, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    let products = await Product.find(query);

    // Sorting
    if (sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (products.length && products.every(product => String(product.sku || '').startsWith('BOX-'))) {
      products.sort((a, b) => String(a.sku).localeCompare(String(b.sku)));
    } else {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const paginatedProducts = products.slice(skip, skip + limitNum);
    const total = products.length;

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products: paginatedProducts.map(p => p.getPublicData ? p.getPublicData() : p),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product: product.getPublicData(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, salePrice, category, image, images, stock, sku, tags } = req.body;

    // Validation
    if (!name || !description || !price || !category || !image || stock === undefined || !sku) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      salePrice: salePrice || null,
      category,
      image,
      images: images || [image],
      stock,
      sku,
      tags: tags || [],
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: product.getPublicData(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, salePrice, category, image, images, stock, sku, tags, isActive, rating } =
      req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if new SKU is unique
    if (sku && sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
      product.sku = sku;
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (salePrice !== undefined) product.salePrice = salePrice;
    if (category) product.category = category;
    if (image) product.image = image;
    if (images) product.images = images;
    if (stock !== undefined) product.stock = stock;
    if (tags) product.tags = tags;
    if (isActive !== undefined) product.isActive = isActive;
    if (rating !== undefined) product.rating = rating;

    const updatedProduct = await Product.findByIdAndUpdate(id, product);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct.getPublicData(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({ category, isActive: true });
    const paginatedProducts = products.slice(skip, skip + limitNum);
    const total = products.length;

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products: paginatedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
exports.updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { stock: quantity });

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product: updatedProduct.getPublicData(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
