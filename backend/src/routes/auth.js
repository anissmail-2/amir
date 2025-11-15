const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain a letter'),
  body('user_type')
    .isIn(['Farmer', 'Gardener', 'Consultant', 'Consumer', 'Restaurant'])
    .withMessage('Invalid user type'),
  body('first_name').optional().trim(),
  body('last_name').optional().trim(),
  body('phone_number').optional().trim()
];

const loginValidation = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
