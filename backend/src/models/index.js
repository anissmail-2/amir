const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// Import models
const models = {
  User: require('./User')(sequelize),
  Farm: require('./Farm')(sequelize),
  Crop: require('./Crop')(sequelize),
  Sensor: require('./Sensor')(sequelize),
  SensorReading: require('./SensorReading')(sequelize),
  Threshold: require('./Threshold')(sequelize),
  Alert: require('./Alert')(sequelize),
  Task: require('./Task')(sequelize),
  Product: require('./Product')(sequelize),
  Order: require('./Order')(sequelize),
  OrderItem: require('./OrderItem')(sequelize),
  Review: require('./Review')(sequelize)
};

// Run associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
