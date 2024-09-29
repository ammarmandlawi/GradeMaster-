const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Ensure the username is unique
        validate: {
            notEmpty: true,  // Username should not be empty
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Ensure the email is unique
        validate: {
            isEmail: true,  // Check if the string is a valid email
            notEmpty: true  // Email should not be empty
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,  // Password should not be empty
        },
    },
});

module.exports = User;
