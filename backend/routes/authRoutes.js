const express = require('express');
const {
  register,
  login,
  logout,
  refreshToken,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Private routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
