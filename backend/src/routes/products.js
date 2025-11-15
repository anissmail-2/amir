const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const productValidation = [
  body('product_name').trim().notEmpty().withMessage('Product name is required'),
  body('category')
    .isIn(['Vegetables', 'Fruits', 'Grains', 'Herbs', 'Flowers', 'Seeds', 'Equipment', 'Other'])
    .withMessage('Invalid category'),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('unit').trim().notEmpty().withMessage('Unit is required'),
  body('quantity_available').isFloat({ min: 0 }).withMessage('Valid quantity is required'),
  body('is_organic').optional().isBoolean(),
  body('harvest_date').optional().isISO8601(),
  body('image_url').optional().isURL()
];

// Routes
router.get('/', optionalAuth, productController.getAllProducts); // Public (with optional auth for personalization)
router.get('/:id', productController.getProductById); // Public
router.post('/', authenticate, authorize('Farmer', 'Gardener'), productValidation, validate, productController.createProduct);
router.put('/:id', authenticate, authorize('Farmer', 'Gardener', 'Admin'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('Farmer', 'Gardener', 'Admin'), productController.deleteProduct);

module.exports = router;
