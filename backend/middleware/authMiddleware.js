const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies (if using cookies)
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.id = user._id;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

// Authorize specific roles
exports.authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };

// Check if user is admin only
exports.admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin users can access this route' });
  }

  next();
};
