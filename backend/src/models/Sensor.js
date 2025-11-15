const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sensor = sequelize.define('Sensor', {
    sensor_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    farm_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'farms',
        key: 'farm_id'
      },
      onDelete: 'CASCADE'
    },
    sensor_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sensor_type: {
      type: DataTypes.ENUM('soil_moisture', 'ph', 'temperature', 'humidity', 'light', 'npk'),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Physical location within the farm (e.g., Field A, Greenhouse 1)'
    },
    calibration_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    battery_level: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    signal_strength: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Signal strength in dBm'
    },
    status: {
      type: DataTypes.ENUM('Online', 'Offline', 'Maintenance', 'Error'),
      allowNull: false,
      defaultValue: 'Online'
    },
    last_reading_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'sensors',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['farm_id']
      },
      {
        fields: ['sensor_type']
      },
      {
        fields: ['status']
      }
    ]
  });

  Sensor.associate = (models) => {
    Sensor.belongsTo(models.Farm, {
      foreignKey: 'farm_id',
      as: 'farm'
    });

    Sensor.hasMany(models.SensorReading, {
      foreignKey: 'sensor_id',
      as: 'readings'
    });

    Sensor.hasMany(models.Threshold, {
      foreignKey: 'sensor_id',
      as: 'thresholds'
    });

    Sensor.hasMany(models.Alert, {
      foreignKey: 'sensor_id',
      as: 'alerts'
    });
  };

  return Sensor;
};
