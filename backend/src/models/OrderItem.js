const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'order_id'
      },
      onDelete: 'CASCADE'
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id'
      },
      onDelete: 'RESTRICT'
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'order_items',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['order_id']
      },
      {
        fields: ['product_id']
      }
    ]
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });

    OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return OrderItem;
};
