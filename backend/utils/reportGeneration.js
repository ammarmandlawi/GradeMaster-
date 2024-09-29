const { Student, Attendance, TaskSubmission } = require('../models');

const generateReport = async (courseId) => {
    const students = await Student.findAll({
        include: [
            {
                model: Attendance,
                where: { courseId }
            },
            {
                model: TaskSubmission,
                include: [
                    {
                        model: Task,
                        where: { courseId }
                    }
                ]
            }
        ]
    });

    // Process and generate the report data based on students' records

    return reportData;  // Processed report data
};

module.exports = generateReport;
