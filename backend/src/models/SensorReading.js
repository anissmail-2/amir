const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SensorReading = sequelize.define('SensorReading', {
    reading_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sensor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'sensor_id'
      },
      onDelete: 'CASCADE'
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    battery_level: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    signal_strength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'sensor_readings',
    timestamps: false, // No created_at/updated_at for time-series data
    underscored: true,
    indexes: [
      {
        fields: ['sensor_id']
      },
      {
        fields: ['timestamp']
      },
      {
        fields: ['sensor_id', 'timestamp']
      }
    ]
  });

  SensorReading.associate = (models) => {
    SensorReading.belongsTo(models.Sensor, {
      foreignKey: 'sensor_id',
      as: 'sensor'
    });
  };

  return SensorReading;
};
