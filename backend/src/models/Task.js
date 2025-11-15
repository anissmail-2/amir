const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    task_id: {
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
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'SET NULL'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
      allowNull: false,
      defaultValue: 'Medium'
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    completed_at: {
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
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['farm_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['priority']
      }
    ]
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Farm, {
      foreignKey: 'farm_id',
      as: 'farm'
    });

    Task.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignee'
    });
  };

  return Task;
};
