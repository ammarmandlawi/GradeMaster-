const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,  // Description can be nullable as it's not explicitly marked as NOT NULL
    },
    course_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Courses', // 'Courses' refers to table name
            key: 'id',
        },
    },
    type: {
        type: DataTypes.ENUM('Assignment', 'Exam'),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

module.exports = Task;
