const jwt = require('jsonwebtoken');
const config = require('../config/app');
const UserModel = require('../models/User.model');

// ── Verify JWT Token ──
const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await UserModel.findWithRoles(decoded.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid' });
  }
};

// ── Check Role ──
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const userRoles = req.user.roles.split(',');
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
