const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

// All dashboard routes require authentication
router.get('/stats', authenticate, dashboardController.getDashboardStats);
router.get('/alerts', authenticate, dashboardController.getRecentAlerts);
router.get('/sensor-summary', authenticate, dashboardController.getSensorSummary);

module.exports = router;
