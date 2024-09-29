const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskSubmission = sequelize.define('TaskSubmission', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Tasks', // 'Tasks' refers to the table name
            key: 'id',
        },
    },
    student_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Students', // 'Students' refers to the table name
            key: 'id',
        },
    },
    grade: {
        type: DataTypes.FLOAT,
        allowNull: true, // Grade can be nullable as it's not explicitly marked as NOT NULL
    },
    submission_date: {
        type: DataTypes.DATEONLY,
        allowNull: true, // Adjust if you don't want it to be nullable
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true, // Feedback can be nullable as it's not explicitly marked as NOT NULL
    },
});

module.exports = TaskSubmission;
