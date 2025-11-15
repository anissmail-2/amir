const mqtt = require('mqtt');
const mqttConfig = require('../config/mqtt');
const { Sensor, SensorReading, Threshold, Alert } = require('../models');

let client = null;

/**
 * Connect to MQTT broker
 */
const connect = () => {
  try {
    client = mqtt.connect(mqttConfig.brokerUrl, {
      clientId: mqttConfig.clientId,
      ...mqttConfig.options
    });

    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker');

      // Subscribe to sensor data topic
      client.subscribe(mqttConfig.topics.sensorData, { qos: mqttConfig.options.qos }, (err) => {
        if (err) {
          console.error('❌ MQTT subscription error:', err);
        } else {
          console.log(`✅ Subscribed to topic: ${mqttConfig.topics.sensorData}`);
        }
      });
    });

    client.on('message', async (topic, message) => {
      try {
        await handleSensorData(topic, message.toString());
      } catch (error) {
        console.error('❌ Error handling MQTT message:', error);
      }
    });

    client.on('error', (error) => {
      console.error('❌ MQTT error:', error);
    });

    client.on('close', () => {
      console.log('⚠️  MQTT connection closed');
    });

    client.on('reconnect', () => {
      console.log('🔄 Reconnecting to MQTT broker...');
    });

  } catch (error) {
    console.error('❌ Failed to connect to MQTT broker:', error);
  }
};

/**
 * Handle incoming sensor data
 * Topic format: sensors/{farm_id}/{sensor_id}/data
 * Message format: JSON with sensor_id, sensor_type, value, unit, etc.
 */
const handleSensorData = async (topic, messageString) => {
  try {
    // Parse message
    const data = JSON.parse(messageString);
    const { sensor_id, value, unit, battery_level, signal_strength } = data;

    console.log(`📡 Received sensor data: ${sensor_id} = ${value} ${unit}`);

    // Find sensor
    const sensor = await Sensor.findByPk(sensor_id);
    if (!sensor) {
      console.warn(`⚠️  Sensor not found: ${sensor_id}`);
      return;
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

    console.log(`✅ Sensor reading saved: ${reading.reading_id}`);

    // Update sensor status
    await sensor.update({
      last_reading_at: new Date(),
      battery_level,
      signal_strength,
      status: 'Online'
    });

    // Check thresholds
    await checkThresholds(sensor, value, unit);

  } catch (error) {
    console.error('❌ Error handling sensor data:', error);
  }
};

/**
 * Check sensor thresholds and create alerts if violated
 */
const checkThresholds = async (sensor, value, unit) => {
  try {
    const thresholds = await Threshold.findAll({
      where: {
        sensor_id: sensor.sensor_id,
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
          sensor_id: sensor.sensor_id,
          farm_id: sensor.farm_id,
          alert_type: 'Threshold Violation',
          severity: threshold.alert_severity,
          message: `${sensor.sensor_name} reading (${value} ${unit}) is ${violationType} threshold (${thresholdValue} ${unit})`
        });

        console.log(`⚠️  Alert created for sensor ${sensor.sensor_name}: ${value} ${unit} ${violationType} ${thresholdValue}`);
      }
    }
  } catch (error) {
    console.error('❌ Error checking thresholds:', error);
  }
};

/**
 * Publish message to MQTT broker
 */
const publish = (topic, message) => {
  if (client && client.connected) {
    client.publish(topic, JSON.stringify(message), { qos: mqttConfig.options.qos });
  } else {
    console.warn('⚠️  MQTT client not connected, cannot publish message');
  }
};

/**
 * Disconnect from MQTT broker
 */
const disconnect = () => {
  if (client) {
    client.end();
    console.log('👋 Disconnected from MQTT broker');
  }
};

module.exports = {
  connect,
  disconnect,
  publish
};
