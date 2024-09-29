const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/user');
const router = express.Router();

router.get('/personal/me', authMiddleware, async (req, res) => {
    try {
        // Find the user by the userId from the authenticated request
        const user = await User.findOne({
            where: { id: req.user.userId },  // Assuming req.user is set by the authMiddleware
            attributes: { exclude: ['password'] }  // Exclude the password from the response
        });

        // If user is not found
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Send the user data
        return res.send({ user });
    } catch (error) {
        // Handle any errors
        return res.status(500).send({ message: error.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        res.cookie('refreshToken', '', { maxAge: 1 });
        res.cookie('isLoggedIn', '', { maxAge: 1 });
        return res.status(200).send({ message: 'Successfully logout' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});


module.exports = router;