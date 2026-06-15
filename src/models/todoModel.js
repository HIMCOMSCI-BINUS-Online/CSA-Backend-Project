const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'todos',
  underscored: true,
});

module.exports = Todo;
