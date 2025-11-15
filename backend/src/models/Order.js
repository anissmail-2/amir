const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    delivery_method: {
      type: DataTypes.ENUM('Pickup', 'Standard Delivery', 'Express Delivery'),
      allowNull: false,
      defaultValue: 'Pickup'
    },
    delivery_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
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
    tableName: 'orders',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['buyer_id']
      },
      {
        fields: ['status']
      }
    ]
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'buyer_id',
      as: 'buyer'
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items'
    });
  };

  return Order;
};
