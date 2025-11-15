const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Crop = sequelize.define('Crop', {
    crop_id: {
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
    crop_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    variety: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    planting_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expected_harvest_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    actual_harvest_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    quantity_planted: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    quantity_harvested: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'kg'
    },
    status: {
      type: DataTypes.ENUM('Planted', 'Growing', 'Flowering', 'Fruiting', 'Harvesting', 'Harvested', 'Failed'),
      allowNull: false,
      defaultValue: 'Planted'
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'crops',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['farm_id']
      },
      {
        fields: ['status']
      }
    ]
  });

  Crop.associate = (models) => {
    Crop.belongsTo(models.Farm, {
      foreignKey: 'farm_id',
      as: 'farm'
    });
  };

  return Crop;
};
