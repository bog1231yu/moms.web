const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { validateEmail, validatePassword } = require('../middleware/validationMiddleware');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => user.getPublicData()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is requesting their own profile or is admin
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this user profile' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicData(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, profileImage } = req.body;

    // Check authorization
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new email is already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      user.email = email;
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicData(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change user password
// @route   POST /api/users/:id/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check authorization
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Not authorized to change this user\'s password' });
    }

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordMatch = await user.matchPassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Check if new password is same as old password
    if (newPassword === currentPassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Check authorization
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    // If user is deleting their own account, require password confirmation
    if (req.user.id === id) {
      if (!password) {
        return res.status(400).json({ message: 'Password is required to delete account' });
      }

      const user = await User.findById(id);
      const isPasswordMatch = await user.matchPassword(password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Password is incorrect' });
      }
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deactivate user account (soft delete)
// @route   PUT /api/users/:id/deactivate
// @access  Private
exports.deactivateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to deactivate this user' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reactivate user account
// @route   PUT /api/users/:id/reactivate
// @access  Private/Admin
exports.reactivateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization - only admin or the user themselves
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to reactivate this user' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account reactivated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    if (!['user', 'admin', 'guest'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: user.getPublicData(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user address
// @route   GET /api/users/:id/address
// @access  Private
exports.getUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this user address' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user address
// @route   PUT /api/users/:id/address
// @access  Private
exports.updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, zipCode, country } = req.body;

    // Check authorization
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user address' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.address = {
      street: street || user.address.street,
      city: city || user.address.city,
      state: state || user.address.state,
      zipCode: zipCode || user.address.zipCode,
      country: country || user.address.country,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
