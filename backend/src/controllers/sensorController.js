const { Sensor, SensorReading, Farm, Threshold, Alert } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all sensors for a farm
 * GET /api/farms/:farmId/sensors
 */
const getFarmSensors = async (req, res, next) => {
  try {
    const { farmId } = req.params;

    // Verify farm exists and user has access
    const farm = await Farm.findByPk(farmId);
    if (!farm) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Farm not found'
      });
    }

    const sensors = await Sensor.findAll({
      where: { farm_id: farmId },
      include: [
        {
          model: Threshold,
          as: 'thresholds',
          where: { is_active: true },
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      sensors,
      count: sensors.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Register new sensor
 * POST /api/sensors
 */
const registerSensor = async (req, res, next) => {
  try {
    const {
      farm_id,
      sensor_name,
      sensor_type,
      location
    } = req.body;

    // Verify farm exists and user owns it
    const farm = await Farm.findByPk(farm_id);
    if (!farm) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Farm not found'
      });
    }

    if (farm.owner_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to register sensors for this farm'
      });
    }

    const sensor = await Sensor.create({
      farm_id,
      sensor_name,
      sensor_type,
      location,
      status: 'Online'
    });

    res.status(201).json({
      message: 'Sensor registered successfully',
      sensor
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get sensor readings
 * GET /api/sensors/:id/readings
 */
const getSensorReadings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 100, hours = 24 } = req.query;

    const sensor = await Sensor.findByPk(id);
    if (!sensor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sensor not found'
      });
    }

    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

    const readings = await SensorReading.findAll({
      where: {
        sensor_id: id,
        timestamp: {
          [Op.gte]: hoursAgo
        }
      },
      limit: parseInt(limit),
      order: [['timestamp', 'DESC']]
    });

    // Get latest reading
    const latestReading = readings.length > 0 ? readings[0] : null;

    res.status(200).json({
      sensor,
      latest_reading: latestReading,
      readings,
      count: readings.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Add sensor reading (typically via MQTT, but also available via HTTP)
 * POST /api/sensors/readings
 */
const addSensorReading = async (req, res, next) => {
  try {
    const {
      sensor_id,
      value,
      unit,
      battery_level,
      signal_strength
    } = req.body;

    const sensor = await Sensor.findByPk(sensor_id);
    if (!sensor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sensor not found'
      });
    }

    // Create reading
    const reading = await SensorReading.create({
      sensor_id,
      value,
      unit,
      battery_level,
      signal_strength,
      timestamp: new Date()
    });

    // Update sensor status
    await sensor.update({
      last_reading_at: new Date(),
      battery_level,
      signal_strength,
      status: 'Online'
    });

    // Check thresholds and create alerts if needed
    const thresholds = await Threshold.findAll({
      where: {
        sensor_id,
        is_active: true
      }
    });

    for (const threshold of thresholds) {
      const isViolation = (
        (threshold.min_value !== null && value < threshold.min_value) ||
        (threshold.max_value !== null && value > threshold.max_value)
      );

      if (isViolation) {
        const violationType = value < threshold.min_value ? 'below' : 'above';
        const thresholdValue = value < threshold.min_value ? threshold.min_value : threshold.max_value;

        await Alert.create({
          sensor_id,
          farm_id: sensor.farm_id,
          alert_type: 'Threshold Violation',
          severity: threshold.alert_severity,
          message: `${sensor.sensor_name} reading (${value} ${unit}) is ${violationType} threshold (${thresholdValue} ${unit})`
        });
      }
    }

    res.status(201).json({
      message: 'Reading added successfully',
      reading
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Set sensor threshold
 * POST /api/sensors/:id/thresholds
 */
const setThreshold = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { min_value, max_value, alert_severity } = req.body;

    const sensor = await Sensor.findByPk(id, {
      include: [{ model: Farm, as: 'farm' }]
    });

    if (!sensor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sensor not found'
      });
    }

    // Check permission
    if (sensor.farm.owner_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to set thresholds for this sensor'
      });
    }

    // Deactivate old thresholds
    await Threshold.update(
      { is_active: false },
      { where: { sensor_id: id } }
    );

    // Create new threshold
    const threshold = await Threshold.create({
      sensor_id: id,
      min_value,
      max_value,
      alert_severity,
      is_active: true
    });

    res.status(201).json({
      message: 'Threshold set successfully',
      threshold
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update sensor
 * PUT /api/sensors/:id
 */
const updateSensor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sensor = await Sensor.findByPk(id, {
      include: [{ model: Farm, as: 'farm' }]
    });

    if (!sensor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sensor not found'
      });
    }

    // Check permission
    if (sensor.farm.owner_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this sensor'
      });
    }

    await sensor.update(req.body);

    res.status(200).json({
      message: 'Sensor updated successfully',
      sensor
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete sensor
 * DELETE /api/sensors/:id
 */
const deleteSensor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sensor = await Sensor.findByPk(id, {
      include: [{ model: Farm, as: 'farm' }]
    });

    if (!sensor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sensor not found'
      });
    }

    // Check permission
    if (sensor.farm.owner_id !== req.user.user_id && req.user.user_type !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this sensor'
      });
    }

    await sensor.destroy();

    res.status(200).json({
      message: 'Sensor deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmSensors,
  registerSensor,
  getSensorReadings,
  addSensorReading,
  setThreshold,
  updateSensor,
  deleteSensor
};
