const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GradeWeight = sequelize.define('GradeWeight', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Courses', // 'Courses' refers to the table name
            key: 'id',
        },
    },
    item_type: {
        type: DataTypes.ENUM('Assignment', 'Exam', 'Attendance'),
        allowNull: false, // This field is NOT NULL as per your schema
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true, // Adjust if you don't want it to be nullable
    },
});

module.exports = GradeWeight;
