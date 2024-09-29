const express = require('express');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/authMiddleware');
const { Course } = require('../models'); // Import Course from models

const router = express.Router();

// Create a new course
router.post('/create', authMiddleware, async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Course name is required' });
        }
        const course = await Course.create({ name, description, user_id: req.user.userId });
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course', error });
    }
});

// Get a specific course by ID
router.get('/getOneCourse/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findOne({ where: { id: req.params.id, user_id: req.user.userId } });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        return res.status(500).json({ message: 'Error fetching course', error });
    }
});

// Get all courses for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const searchQuery = req.query.q ? req.query.q : '';  // Search query from the request
        const userId = req.user.userId;  // Assuming the user ID is stored in req.user

        // Construct filter based on search query
        const filterParams = {
            user_id: userId,
            [Op.or]: [
                { name: { [Op.like]: `%${searchQuery}%` } },  // Search in name
                { description: { [Op.like]: `%${searchQuery}%` } }  // Search in description
            ]
        };

        // Fetch courses that match the user and search query
        const courses = await Course.findAll({ where: filterParams });

        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error });
    }
});

// Update a specific course by ID
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const course = await Course.findOne({ where: { id, user_id: req.user.userId } });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.update({ name, description });
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Error updating course', error });
    }
});

// Delete a specific course by ID
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findOne({ where: { id, user_id: req.user.userId } });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.destroy();
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Error deleting course', error });
    }
});

module.exports = router;
