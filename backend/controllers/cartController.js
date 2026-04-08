const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Use product's sale price if available, otherwise regular price
    const price = product.salePrice || product.price;

    // Add item to cart
    cart.addItem(productId, quantity, price);

    // Save cart
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if quantity is valid
    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // Get product to check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > 0 && product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Update quantity
    cart.updateItemQuantity(productId, quantity);

    // Save cart
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item
    cart.removeItem(productId);

    // Save cart
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.clearCart();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply discount code
// @route   POST /api/cart/discount
// @access  Private
exports.applyDiscount = async (req, res) => {
  try {
    const { discountCode, discountAmount } = req.body;

    if (!discountCode || discountAmount === undefined) {
      return res.status(400).json({ message: 'Discount code and amount are required' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.discountCode = discountCode;
    cart.discountAmount = discountAmount;
    cart.calculateTotals();

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Discount applied',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply shipping cost
// @route   POST /api/cart/shipping
// @access  Private
exports.applyShipping = async (req, res) => {
  try {
    const { shippingCost } = req.body;

    if (shippingCost === undefined) {
      return res.status(400).json({ message: 'Shipping cost is required' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.shippingCost = shippingCost;
    cart.calculateTotals();

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Shipping cost applied',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
