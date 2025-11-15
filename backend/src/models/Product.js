const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    product_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Vegetables', 'Fruits', 'Grains', 'Herbs', 'Flowers', 'Seeds', 'Equipment', 'Other'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'kg'
    },
    quantity_available: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    is_organic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    harvest_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Available', 'Out of Stock', 'Discontinued'),
      allowNull: false,
      defaultValue: 'Available'
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
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['seller_id']
      },
      {
        fields: ['category']
      },
      {
        fields: ['status']
      }
    ]
  });

  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      foreignKey: 'seller_id',
      as: 'seller'
    });

    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'order_items'
    });

    Product.hasMany(models.Review, {
      foreignKey: 'product_id',
      as: 'reviews'
    });
  };

  return Product;
};
