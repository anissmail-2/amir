const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    });

    // Find user
    const user = await User.findByPk(decoded.user_id);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User account is not active'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired'
      });
    }

    next(error);
  }
};

/**
 * Check if user has required role
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access restricted to: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Optional authentication (attach user if token present, but don't require it)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await User.findByPk(decoded.user_id);

      if (user && user.status === 'Active') {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
