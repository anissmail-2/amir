const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alert = sequelize.define('Alert', {
    alert_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sensor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'sensors',
        key: 'sensor_id'
      },
      onDelete: 'SET NULL'
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
    alert_type: {
      type: DataTypes.ENUM('Threshold Violation', 'Sensor Offline', 'Battery Low', 'System', 'Other'),
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('Info', 'Warning', 'Critical'),
      allowNull: false,
      defaultValue: 'Warning'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_acknowledged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    acknowledged_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acknowledged_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'alerts',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['farm_id']
      },
      {
        fields: ['severity']
      },
      {
        fields: ['is_acknowledged']
      }
    ]
  });

  Alert.associate = (models) => {
    Alert.belongsTo(models.Sensor, {
      foreignKey: 'sensor_id',
      as: 'sensor'
    });

    Alert.belongsTo(models.Farm, {
      foreignKey: 'farm_id',
      as: 'farm'
    });
  };

  return Alert;
};
