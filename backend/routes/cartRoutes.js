const express = require('express');
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  applyDiscount,
  applyShipping,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/discount', applyDiscount);
router.post('/shipping', applyShipping);

module.exports = router;
