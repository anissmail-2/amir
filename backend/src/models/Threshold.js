const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Threshold = sequelize.define('Threshold', {
    threshold_id: {
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
    min_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    max_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    alert_severity: {
      type: DataTypes.ENUM('Info', 'Warning', 'Critical'),
      allowNull: false,
      defaultValue: 'Warning'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'thresholds',
    timestamps: true,
    underscored: true
  });

  Threshold.associate = (models) => {
    Threshold.belongsTo(models.Sensor, {
      foreignKey: 'sensor_id',
      as: 'sensor'
    });
  };

  return Threshold;
};
