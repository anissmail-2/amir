require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const mqttService = require('./src/services/mqttService');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database models (development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    }

    // Start MQTT service
    mqttService.connect();
    console.log('✅ MQTT service connected.');

    // Start Express server
    app.listen(PORT, HOST, () => {
      console.log(`✅ Server running at http://${HOST}:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV}`);
      console.log(`🚀 API ready at http://${HOST}:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await sequelize.close();
  mqttService.disconnect();
  process.exit(0);
});

startServer();
