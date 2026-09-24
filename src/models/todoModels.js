const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending'
    },
    estimatedHours: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'todos',
    timestamps: true
})

module.exports = Todo