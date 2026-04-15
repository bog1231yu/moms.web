const express = require('express');
const Product = require('../models/productModel');

const router = express.Router();

const ADMIN_CODE = process.env.ADMIN_CODE || '1234';

function requireAdminCode(req, res, next) {
  const code = req.headers['x-admin-code'] || req.body.adminCode || req.query.adminCode;
  if (code !== ADMIN_CODE) {
    return res.status(401).json({ success: false, message: 'Invalid admin code' });
  }
  next();
}

function normalizeBox(product, index) {
  const boxNumber = index + 1;
  return {
    _id: product._id || `box-${boxNumber}`,
    name: `box${boxNumber}`,
    description: product.description || '',
    price: Number(product.price || 0),
    salePrice: null,
    category: 'Box',
    image: product.image || '',
    images: product.image ? [product.image] : [],
    stock: Number(product.stock || 100),
    sku: `BOX-${String(boxNumber).padStart(3, '0')}`,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    tags: Array.isArray(product.tags) ? product.tags : [],
    isActive: true,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

router.get('/boxes', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    const boxes = Array.from({ length: 8 }, (_, index) => {
      const sku = `BOX-${String(index + 1).padStart(3, '0')}`;
      const product = products.find(item => item.sku === sku) || products[index] || {};
      return normalizeBox(product, index);
    });

    res.json({ success: true, boxes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/boxes', requireAdminCode, async (req, res) => {
  try {
    const boxes = Array.isArray(req.body.boxes) ? req.body.boxes : [];
    if (boxes.length !== 8) {
      return res.status(400).json({ success: false, message: 'Exactly 8 boxes are required' });
    }

    const existingProducts = await Product.find();
    const nonBoxProducts = existingProducts.filter(product => !String(product.sku || '').startsWith('BOX-'));
    const normalizedBoxes = boxes.map((box, index) => normalizeBox(box, index));
    await Product.replaceAll([...normalizedBoxes, ...nonBoxProducts]);

    res.json({ success: true, message: 'Boxes saved successfully', boxes: normalizedBoxes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;