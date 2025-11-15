const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const farmController = require('../controllers/farmController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const farmValidation = [
  body('farm_name').trim().notEmpty().withMessage('Farm name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('size_hectares').optional().isFloat({ min: 0 }),
  body('farm_type')
    .isIn(['Outdoor', 'Indoor', 'Greenhouse', 'Hydroponic', 'Vertical'])
    .withMessage('Invalid farm type'),
  body('description').optional().trim(),
  body('image_url').optional().isURL()
];

// Routes
router.get('/', farmController.getAllFarms); // Public
router.get('/my-farms', authenticate, authorize('Farmer', 'Gardener'), farmController.getMyFarms);
router.get('/:id', farmController.getFarmById); // Public
router.post('/', authenticate, authorize('Farmer', 'Gardener'), farmValidation, validate, farmController.createFarm);
router.put('/:id', authenticate, authorize('Farmer', 'Gardener', 'Admin'), farmController.updateFarm);
router.delete('/:id', authenticate, authorize('Farmer', 'Gardener', 'Admin'), farmController.deleteFarm);

module.exports = router;
