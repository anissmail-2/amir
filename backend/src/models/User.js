const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_type: {
      type: DataTypes.ENUM('Farmer', 'Gardener', 'Consultant', 'Consumer', 'Restaurant', 'Admin'),
      allowNull: false,
      defaultValue: 'Farmer'
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Active', 'Pending', 'Suspended', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    },
    profile_picture_url: {
      type: DataTypes.STRING(500),
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
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password_hash; // Never expose password hash
    return values;
  };

  // Class methods
  User.associate = (models) => {
    User.hasMany(models.Farm, {
      foreignKey: 'owner_id',
      as: 'farms'
    });

    User.hasMany(models.Product, {
      foreignKey: 'seller_id',
      as: 'products'
    });

    User.hasMany(models.Order, {
      foreignKey: 'buyer_id',
      as: 'purchases'
    });

    User.hasMany(models.Review, {
      foreignKey: 'reviewer_id',
      as: 'reviews'
    });
  };

  return User;
};
