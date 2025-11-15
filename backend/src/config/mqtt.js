require('dotenv').config();

module.exports = {
  brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
  clientId: process.env.MQTT_CLIENT_ID || 'sufms-backend',
  topics: {
    sensorData: 'sensors/+/+/data', // Pattern: sensors/{farm_id}/{sensor_id}/data
    sensorStatus: 'sensors/+/+/status',
    commands: 'sensors/+/+/commands'
  },
  options: {
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    qos: 1 // At least once delivery
  }
};
