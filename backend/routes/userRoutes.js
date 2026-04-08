const express = require('express');
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
  deactivateAccount,
  reactivateAccount,
  updateUserRole,
  getUserAddress,
  updateUserAddress,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, admin, getAllUsers);

// Get user profile
router.get('/:id', protect, getUserProfile);

// Update user profile
router.put('/:id', protect, updateUserProfile);

// Change password
router.post('/:id/change-password', protect, changePassword);

// Delete user account
router.delete('/:id', protect, deleteUserAccount);

// Deactivate account
router.put('/:id/deactivate', protect, deactivateAccount);

// Reactivate account
router.put('/:id/reactivate', protect, reactivateAccount);

// Update user role (Admin only)
router.put('/:id/role', protect, admin, updateUserRole);

// Get user address
router.get('/:id/address', protect, getUserAddress);

// Update user address
router.put('/:id/address', protect, updateUserAddress);

module.exports = router;
