const express = require('express');
const { Op } = require('sequelize');
const authMiddleware = require('../middlewares/authMiddleware');
const { Attendance, Student, Course } = require('../models');

const router = express.Router();

// Create a new attendance record
router.post('/create', authMiddleware, async (req, res) => {
    const { date, status, student_id, course_id } = req.body;
    try {
        if (!date || !status || !student_id || !course_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const attendance = await Attendance.create({
            date,
            status,
            student_id: student_id,
            course_id: course_id,
        });
        res.status(201).json({ message: 'Attendance recorded successfully', attendance });
    } catch (error) {
        console.error('Error recording attendance:', error);
        res.status(500).json({ message: 'Error recording attendance', error });
    }
});

// Retrieve all attendance records
router.get('/', authMiddleware, async (req, res) => {
    try {
        const searchQuery = req.query.q ? req.query.q : '';  // Extract search query from the request
        const statusFilter = req.query.status || '';  // Extract status filter from the request
        const startDate = req.query.startDate || '';  // Extract start date filter
        const endDate = req.query.endDate || '';  // Extract end date filter

        const attendanceWhere = {};

        if (startDate && endDate) {
            attendanceWhere.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        if (statusFilter) {
            attendanceWhere.status = statusFilter;
        }

        const attendanceRecords = await Attendance.findAll({
            where: attendanceWhere,
            include: [
                {
                    model: Student,  // Include student data
                    attributes: ['id', 'name', 'email'],  // Select fields to include
                    where: {
                        name: {
                            [Op.like]: `%${searchQuery}%`  // Apply search query to student name
                        }
                    }
                },
                {
                    model: Course,  // Include course data
                    as: 'course',  // Use the alias specified in the association
                    attributes: ['id', 'name', 'description'],  // Select fields to include
                }
            ]
        });

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ message: 'Error fetching attendance records', error });
    }
});

// Get a specific attendance record by ID
router.get('/getOneAttendance/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const attendance = await Attendance.findByPk(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance record:', error);
        res.status(500).json({ message: 'Error fetching attendance record', error });
    }
});

// Update attendance record
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { student_id, course_id, date, status } = req.body;

    try {
        const attendance = await Attendance.findByPk(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        await attendance.update({ student_id, course_id, date, status });
        res.status(200).json({ message: 'Attendance updated successfully', attendance });
    } catch (error) {
        res.status(500).json({ message: 'Error updating attendance', error });
    }
});

// Delete attendance record
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const attendance = await Attendance.findByPk(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        await attendance.destroy();
        res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting attendance', error });
    }
});


module.exports = router;
