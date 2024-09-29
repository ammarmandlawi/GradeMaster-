const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) return res.status(403).send('Access denied. Please check your API token');

        try {
            const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
            req.user = verified;

            // Fetch user from MySQL using Sequelize
            let user;
            user = await User.findOne({ where: { id: req.user.userId } });

            if (!user) {
                return res.status(404).send('User not found');
            }

            next();
        } catch (err) {
            res.status(401).send('Invalid or expired auth token');
        }
    } else {
        return res.status(401).json('Malformed or unauthenticated auth token');
    }
};

module.exports = authMiddleware;
