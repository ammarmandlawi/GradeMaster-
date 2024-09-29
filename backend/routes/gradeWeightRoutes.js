const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { GradeWeight, Course } = require('../models');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'public', 'grade'); // Correct absolute path
        // Ensure the directory exists, if not create it
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `grade-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

// Create a new grade weight
router.post('/create', authMiddleware, async (req, res) => {
    const { item_type, weight, course_id } = req.body;
    try {
        const gradeWeight = await GradeWeight.create({
            item_type: item_type,
            weight,
            course_id: course_id
        });
        res.status(201).json({ message: 'Grade weight set successfully', gradeWeight });
    } catch (error) {
        res.status(500).json({ message: 'Error setting grade weight', error });
    }
});

// Get all grade weights
router.get('/', authMiddleware, async (req, res) => {
    try {
        const gradeWeights = await GradeWeight.findAll({
            include: [
                {
                    model: Course, // Include course information
                    as: 'course',
                    attributes: ['id', 'name', 'description'] // Specify which attributes you want from Course
                }
            ]
        });
        res.status(200).json(gradeWeights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Retrieve a specific GradeWeight by ID
router.get('/getOneGradeWeight/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const gradeWeight = await GradeWeight.findByPk(id);
        if (!gradeWeight) {
            return res.status(404).json({ message: 'GradeWeight not found' });
        }
        res.status(200).json(gradeWeight);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an existing grade weight
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { item_type, weight, course_id } = req.body;

    try {
        const gradeWeight = await GradeWeight.findByPk(req.params.id);
        if (!gradeWeight) {
            return res.status(404).json({ message: 'Grade weight not found' });
        }
        await gradeWeight.update({
            item_type: item_type,
            weight,
            course_id: course_id
        });
        res.status(200).json({ message: 'Grade weight updated successfully', gradeWeight });
    } catch (error) {
        res.status(500).json({ message: 'Error updating grade weight', error });
    }
});

// Delete a grade weight
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const gradeWeight = await GradeWeight.findByPk(id);
        if (!gradeWeight) {
            return res.status(404).json({ message: 'Grade weight not found' });
        }
        await gradeWeight.destroy();
        res.status(200).json({ message: 'Grade weight deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting grade weight', error });
    }
});

router.post('/import', authMiddleware, upload.single('file'), async (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'grade', req.file.filename);
    const gradeWeights = [];
    const success = [];
    const errors = [];

    fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
            gradeWeights.push(row);
        })
        .on('end', async () => {
            try {
                for (const gradeWeightData of gradeWeights) {
                    try {
                        const { course_id, item_type, weight } = gradeWeightData;

                        const gradeWeight = await GradeWeight.create({
                            course_id,
                            item_type,
                            weight
                        });

                        success.push(gradeWeight);
                    } catch (error) {
                        errors.push({ gradeWeight: gradeWeightData, message: error.message });
                    }
                }

                fs.unlinkSync(filePath);  // Clean up the uploaded file

                res.status(200).json({
                    message: 'Grade weights import completed',
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
