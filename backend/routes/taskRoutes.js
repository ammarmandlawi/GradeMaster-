const express = require('express');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/authMiddleware');
const { Task } = require('../models');

const router = express.Router();

// Create a new task
router.post('/create', authMiddleware, async (req, res) => {
    const { name, type, date, course_id, description } = req.body;
    try {
        const task = await Task.create({ name, type, date, course_id, description });
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// Retrieve tasks by course ID
router.get('/', authMiddleware, async (req, res) => {
    try {
        const searchQuery = req.query.q ? req.query.q : '';  // Extract search query from the request

        // Search tasks by name using the search query
        const tasks = await Task.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchQuery}%`  // Apply search query to task name
                }
            }
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Retrieve a specific task by ID
router.get('/getOneTask/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
});

// Update a task
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, type, date, course_id, description } = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.update({ name, type, date, course_id, description });
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// Delete a task
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

module.exports = router;
