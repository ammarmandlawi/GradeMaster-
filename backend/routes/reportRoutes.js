const express = require('express');
const { Student, Course, Attendance, TaskSubmission, GradeWeight, Task } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Endpoint to generate a performance report for all students
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Retrieve all students along with their courses
        const students = await Student.findAll({
            include: [{
                model: Course,
                as: 'courses',
                through: { attributes: [] }, // Removing intermediate table attributes
                include: [
                    {
                        model: Task,
                        as: 'tasks',
                        include: [
                            {
                                model: TaskSubmission,
                                as: 'submissions',
                                include: [{ model: Student, as: 'student' }] // Link TaskSubmission to Student
                            }
                        ]
                    },
                    {
                        model: Attendance,
                        as: 'attendances' // Include attendance information for the course
                    },
                    {
                        model: GradeWeight,
                        as: 'gradeWeights' // Include grade weights for the course
                    }
                ]
            }]
        });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        const reports = [];

        // Loop through each student and generate the report
        for (const student of students) {
            const studentReport = {
                studentId: student.id,
                studentName: student.name,
                courses: []
            };

            // Loop through each course for the student and gather information
            for (const course of student.courses) {
                // Fetch attendance and tasks directly from the include
                const attendanceRecords = course.attendances || [];
                const taskSubmissions = course.tasks.reduce((acc, task) => {
                    acc.push(...task.submissions);
                    return acc;
                }, []);

                // Calculate total grade from task submissions
                let totalGrade = 0;
                taskSubmissions.forEach(submission => {
                    totalGrade += submission.grade || 0; // Assuming 'grade' is a field in TaskSubmission
                });

                // Get grade weights for the course
                const gradeWeights = course.gradeWeights || [];

                // Store the report data for the course
                const courseReport = {
                    courseName: course.name,
                    attendance: attendanceRecords,
                    tasks: taskSubmissions,
                    totalGrade,
                    gradeWeights
                };

                // Push course report to the student's courses array
                studentReport.courses.push(courseReport);
            }

            // Add student report to the reports array
            reports.push(studentReport);
        }

        // Return the reports for all students as an array
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error generating reports:', error);
        res.status(500).json({ message: 'Error generating reports', error });
    }
});

module.exports = router;
