const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const sensorController = require('../controllers/sensorController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Validation rules
const sensorValidation = [
  body('farm_id').isUUID().withMessage('Valid farm ID is required'),
  body('sensor_name').trim().notEmpty().withMessage('Sensor name is required'),
  body('sensor_type')
    .isIn(['soil_moisture', 'ph', 'temperature', 'humidity', 'light', 'npk'])
    .withMessage('Invalid sensor type'),
  body('location').optional().trim()
];

const readingValidation = [
  body('sensor_id').isUUID().withMessage('Valid sensor ID is required'),
  body('value').isFloat().withMessage('Valid numeric value is required'),
  body('unit').trim().notEmpty().withMessage('Unit is required'),
  body('battery_level').optional().isFloat({ min: 0, max: 100 }),
  body('signal_strength').optional().isInt()
];

const thresholdValidation = [
  body('min_value').optional().isFloat(),
  body('max_value').optional().isFloat(),
  body('alert_severity')
    .isIn(['Info', 'Warning', 'Critical'])
    .withMessage('Invalid alert severity')
];

// Routes
router.post('/', authenticate, authorize('Farmer', 'Gardener'), sensorValidation, validate, sensorController.registerSensor);
router.get('/:id/readings', authenticate, sensorController.getSensorReadings);
router.post('/readings', readingValidation, validate, sensorController.addSensorReading); // Used by MQTT service
router.post('/:id/thresholds', authenticate, authorize('Farmer', 'Gardener'), thresholdValidation, validate, sensorController.setThreshold);
router.put('/:id', authenticate, authorize('Farmer', 'Gardener', 'Admin'), sensorController.updateSensor);
router.delete('/:id', authenticate, authorize('Farmer', 'Gardener', 'Admin'), sensorController.deleteSensor);

module.exports = router;
