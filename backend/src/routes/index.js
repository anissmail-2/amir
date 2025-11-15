const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const farmRoutes = require('./farms');
const sensorRoutes = require('./sensors');
const productRoutes = require('./products');
const dashboardRoutes = require('./dashboard');

// Mount routes
router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/sensors', sensorRoutes);
router.use('/products', productRoutes);
router.use('/dashboard', dashboardRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'SUFMS API',
    version: '1.0.0',
    description: 'Smart Urban Farming Management System API',
    endpoints: {
      auth: '/api/auth',
      farms: '/api/farms',
      sensors: '/api/sensors',
      products: '/api/products',
      dashboard: '/api/dashboard'
    },
    documentation: 'See README.md for full API documentation'
  });
});

module.exports = router;
