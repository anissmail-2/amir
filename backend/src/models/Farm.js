const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Farm = sequelize.define('Farm', {
    farm_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    farm_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      validate: {
        min: -180,
        max: 180
      }
    },
    size_hectares: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    farm_type: {
      type: DataTypes.ENUM('Outdoor', 'Indoor', 'Greenhouse', 'Hydroponic', 'Vertical'),
      allowNull: false,
      defaultValue: 'Outdoor'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
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
    tableName: 'farms',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['owner_id']
      },
      {
        fields: ['status']
      }
    ]
  });

  Farm.associate = (models) => {
    Farm.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner'
    });

    Farm.hasMany(models.Crop, {
      foreignKey: 'farm_id',
      as: 'crops'
    });

    Farm.hasMany(models.Sensor, {
      foreignKey: 'farm_id',
      as: 'sensors'
    });

    Farm.hasMany(models.Task, {
      foreignKey: 'farm_id',
      as: 'tasks'
    });
  };

  return Farm;
};
