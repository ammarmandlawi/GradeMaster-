const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {  
    const { username, email, password } = req.body;  
    const hashedPassword = await bcrypt.hash(password, 10);  

    try {  
        const existingUser = await User.findOne({ where: { username } });  

        if(existingUser) {  
            return res.status(400).json({ message: 'User with this username already exists' });  
        }  
        
        const existingEmail = await User.findOne({ where: { email } });  

        if(existingEmail) {  
            return res.status(400).json({ message: 'User with this email already exists' });  
        }  

        const newUser = await User.create({ username, email, password: hashedPassword });  
        res.status(201).json({ message: 'User created successfully', user: newUser });  
        
    } catch (error) {  
        res.status(500).json({ message: 'Error creating user', error });  
    }  
});

router.post('/login', async (req, res) => {  
    const { username, password } = req.body;  
    try {  
        const user = await User.findOne({ where: { username } });  
        if(!user) {  
            res.status(401).send({ message: 'User does not exist' });  
        }   
        else {  
            const validPassword = await bcrypt.compare(password, user.password);  
            if(!validPassword) {  
                res.status(401).send({ message: 'Incorrect password' });  
            } else {  
                const accessToken = jwt.sign({ userId: user.id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '1d' });  
                const refreshToken = jwt.sign({ _id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });
                const { password, ...userWithoutPassword } = user.dataValues; // Omit the password from the user data  
                res.cookie('refreshToken', refreshToken, {
                    secure: process.env.NODE_ENV !== 'development',
                    expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
                    httpOnly: false,
                });
                res.cookie('isLoggedIn', true, {
                    secure: process.env.NODE_ENV !== 'development',
                    expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
                    httpOnly: false,
                });
                res.status(200).send({ message: 'User login successful', accessToken, userData: userWithoutPassword });  
            }  
        }  
    } catch (error) {  
        res.status(500).json({ message: 'Error logging in', error });  
    }  
});  

module.exports = router;
