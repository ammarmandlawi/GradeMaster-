const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Course = require('../models/course');
const Student = require('../models/student');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { Op } = require('sequelize');
const moment = require('moment');

const router = express.Router();

// Configure multer storage with correct path
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'public', 'student'); // Correct absolute path
        // Ensure the directory exists, if not create it
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `student-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

// Create a new student and associate with courses
router.post('/create', authMiddleware, async (req, res) => {
    const { name, email, phone, gender, date_of_birth, address, courseIds } = req.body; 

    try {
        const courses = await Course.findAll({
            where: { id: courseIds }
        });

        if (courses.length !== courseIds.length) {
            return res.status(400).json({ message: 'One or more course IDs are invalid' });
        }

        const student = await Student.create({ name, email, phone, gender, date_of_birth, address });
        await student.setCourses(courses);  

        res.status(201).json({ message: 'Student created successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error creating student', error });
    }
});

// Get all students with their associated courses
router.get('/', authMiddleware, async (req, res) => {
    try {
        const searchQuery = req.query.q ? req.query.q : '';  // Extract search query from the request

        // Define filter for searching students by name
        const studentFilter = {
            [Op.or]: [
                { name: { [Op.like]: `%${searchQuery}%` } }  // Search in student name
            ]
        };

        // Fetch students that match the filter and include their associated courses
        const students = await Student.findAll({
            where: studentFilter,
            include: {
                model: Course,
                as: 'courses',
                through: { attributes: [] }  // Exclude the intermediate table attributes (StudentCourses)
            }
        });

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students', error });
    }
});

// Update a student
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, gender, date_of_birth, address, courseIds } = req.body;

    try {
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.name = name || student.name;
        student.email = email || student.email;
        student.phone = phone || student.phone;
        student.gender = gender || student.gender;
        student.date_of_birth = date_of_birth || student.date_of_birth;
        student.address = address || student.address;
        await student.save();

        if (courseIds) {
            const courses = await Course.findAll({ where: { id: courseIds } });
            if (courses.length !== courseIds.length) {
                return res.status(400).json({ message: 'One or more course IDs are invalid' });
            }
            await student.setCourses(courses);  
        }

        res.status(200).json({ message: 'Student updated successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
});

// Delete a student
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.destroy();  
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
});

// Get a specific student by ID with associated courses
router.get('/getOneStudent/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { id: req.params.id },
            include: {
                model: Course, 
                through: { attributes: [] }, 
                as: 'courses'
            }
        });
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(student);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching student', error });
    }
});

// Import students from CSV
router.post('/import', authMiddleware, upload.single('file'), async (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'student', req.file.filename);
    const students = [];
    const success = [];
    const errors = [];

    fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
            students.push(row);
        })
        .on('end', async () => {
            try {
                for (const studentData of students) {
                    try {
                        const { name, email, phone, gender, date_of_birth, address } = studentData;
                        var dateOfBirth = moment(date_of_birth, "M/D/YYYY");
                        const [student, created] = await Student.findOrCreate({
                            where: { email }, 
                            defaults: { name, phone, gender, date_of_birth: dateOfBirth.format("YYYY-MM-DD"), address }
                        });

                        if (created) {
                            success.push(student);
                        } else {
                            errors.push({ student: studentData, message: 'Email already exists' });
                        }
                    } catch (error) {
                        errors.push({ student: studentData, message: 'Error creating student' });
                    }
                }

                fs.unlinkSync(filePath);

                res.status(200).json({
                    message: 'Students import process completed',
                    successCount: success.length,
                    errorCount: errors.length,
                    errors
                });
            } catch (error) {
                res.status(500).json({ message: 'Error processing CSV', error });
            }
        });
});

module.exports = router;
