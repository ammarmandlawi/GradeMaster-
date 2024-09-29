const express = require('express');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/authMiddleware');
const { TaskSubmission, Student, Task } = require('../models');

const router = express.Router();

// Create a new task submission
router.post('/create', authMiddleware, async (req, res) => {
    const { grade, submission_date, student_id, task_id, feedback } = req.body;
    try {
        const taskSubmission = await TaskSubmission.create({ grade, submission_date: submission_date, student_id: student_id, task_id: task_id, feedback: feedback });
        res.status(201).json({ message: 'Task submission recorded successfully', taskSubmission });
    } catch (error) {
        res.status(500).json({ message: 'Error recording task submission', error });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const searchQuery = req.query.q ? req.query.q : '';  // Extract search query from the request

        // Fetch task submissions with filter on task name using search query
        const submissions = await TaskSubmission.findAll({
            include: [
                {
                    model: Student, 
                    as: 'student', // Alias if defined in associations
                    attributes: ['id', 'name', 'email'], // Select specific fields from Student
                },
                {
                    model: Task, 
                    as: 'task', // Alias if defined in associations
                    attributes: ['id', 'name', 'type', 'date'], // Select specific fields from Task
                    where: {
                        name: {
                            [Op.like]: `%${searchQuery}%`  // Apply search query to task name
                        }
                    }
                }
            ]
        });

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Error fetching submissions', error });
    }
});

// Retrieve a specific task submission by ID
router.get('/getOneTaskSubmission/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const submission = await TaskSubmission.findByPk(id);
        if (!submission) {
            return res.status(404).json({ message: 'Task submission not found' });
        }
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submission', error });
    }
});

// Update a task submission
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { grade, submission_date, student_id, task_id, feedback } = req.body;

    try {
        const submission = await TaskSubmission.findByPk(id);
        if (!submission) {
            return res.status(404).json({ message: 'Task submission not found' });
        }
        await submission.update({ grade, submission_date, student_id: student_id, task_id: task_id, feedback: feedback });
        res.status(200).json({ message: 'Task submission updated successfully', submission });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task submission', error });
    }
});

// Delete a task submission
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const submission = await TaskSubmission.findByPk(id);
        if (!submission) {
            return res.status(404).json({ message: 'Task submission not found' });
        }
        await submission.destroy();
        res.status(200).json({ message: 'Task submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task submission', error });
    }
});

module.exports = router;
