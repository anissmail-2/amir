const { Farm, Sensor, Alert, Task, Crop, Product, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const userType = req.user.user_type;

    const stats = {};

    // Stats for Farmers/Gardeners
    if (['Farmer', 'Gardener'].includes(userType)) {
      // Farm count
      const farmCount = await Farm.count({
        where: { owner_id: userId, status: 'Active' }
      });

      // Sensor count
      const sensorCount = await Sensor.count({
        include: [{
          model: Farm,
          as: 'farm',
          where: { owner_id: userId }
        }]
      });

      // Active sensors
      const activeSensorCount = await Sensor.count({
        where: { status: 'Online' },
        include: [{
          model: Farm,
          as: 'farm',
          where: { owner_id: userId }
        }]
      });

      // Crop count
      const cropCount = await Crop.count({
        include: [{
          model: Farm,
          as: 'farm',
          where: { owner_id: userId }
        }],
        where: { status: { [Op.in]: ['Planted', 'Growing', 'Flowering', 'Fruiting'] } }
      });

      // Pending tasks
      const pendingTaskCount = await Task.count({
        include: [{
          model: Farm,
          as: 'farm',
          where: { owner_id: userId }
        }],
        where: { status: 'Pending' }
      });

      // Critical alerts (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const criticalAlertCount = await Alert.count({
        include: [{
          model: Farm,
          as: 'farm',
          where: { owner_id: userId }
        }],
        where: {
          severity: 'Critical',
          is_acknowledged: false,
          created_at: { [Op.gte]: sevenDaysAgo }
        }
      });

      stats.farms = farmCount;
      stats.sensors = { total: sensorCount, online: activeSensorCount };
      stats.crops = cropCount;
      stats.pending_tasks = pendingTaskCount;
      stats.critical_alerts = criticalAlertCount;
    }

    // Stats for Consumers/Restaurants
    if (['Consumer', 'Restaurant'].includes(userType)) {
      // Products available in marketplace
      const availableProductCount = await Product.count({
        where: { status: 'Available' }
      });

      stats.available_products = availableProductCount;
    }

    // Stats for Admin
    if (userType === 'Admin') {
      const totalFarms = await Farm.count();
      const totalUsers = await sequelize.models.User.count();
      const totalProducts = await Product.count();

      stats.total_farms = totalFarms;
      stats.total_users = totalUsers;
      stats.total_products = totalProducts;
    }

    res.status(200).json({
      stats
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get recent alerts
 * GET /api/dashboard/alerts
 */
const getRecentAlerts = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const alerts = await Alert.findAll({
      include: [
        {
          model: Farm,
          as: 'farm',
          where: { owner_id: req.user.user_id }
        },
        {
          model: Sensor,
          as: 'sensor',
          required: false
        }
      ],
      where: { is_acknowledged: false },
      limit: parseInt(limit),
      order: [
        ['severity', 'DESC'], // Critical first
        ['created_at', 'DESC']
      ]
    });

    res.status(200).json({
      alerts,
      count: alerts.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get sensor summary
 * GET /api/dashboard/sensor-summary
 */
const getSensorSummary = async (req, res, next) => {
  try {
    const sensors = await Sensor.findAll({
      include: [{
        model: Farm,
        as: 'farm',
        where: { owner_id: req.user.user_id }
      }],
      attributes: [
        'sensor_id',
        'sensor_name',
        'sensor_type',
        'status',
        'battery_level',
        'last_reading_at'
      ],
      limit: 10,
      order: [['last_reading_at', 'DESC']]
    });

    res.status(200).json({
      sensors,
      count: sensors.length
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRecentAlerts,
  getSensorSummary
};
