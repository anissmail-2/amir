const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    review_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id'
      },
      onDelete: 'CASCADE'
    },
    reviewer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_verified_purchase: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reviews',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['product_id']
      },
      {
        fields: ['reviewer_id']
      },
      {
        fields: ['rating']
      }
    ]
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });

    Review.belongsTo(models.User, {
      foreignKey: 'reviewer_id',
      as: 'reviewer'
    });
  };

  return Review;
};
