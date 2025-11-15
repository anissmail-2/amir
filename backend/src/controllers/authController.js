const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtConfig = require('../config/jwt');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      user_type: user.user_type
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    }
  );
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, user_type, first_name, last_name, phone_number } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password_hash: password, // Will be hashed by model hook
      user_type,
      first_name,
      last_name,
      phone_number,
      status: 'Active'
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Check user status
    if (user.status !== 'Active') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Your account is not active. Please contact support.'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached by authenticate middleware
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] }
    });

    res.status(200).json({
      user
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (client-side token deletion)
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by deleting the token. This endpoint exists for consistency
    // and could be extended to implement token blacklisting.

    res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
