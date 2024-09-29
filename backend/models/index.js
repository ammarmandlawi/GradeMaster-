
const User = require('./user');
const Course = require('./course');
const Student = require('./student');
const Attendance = require('./attendance');
const Task = require('./task');
const TaskSubmission = require('./taskSubmission');
const GradeWeight = require('./gradeWeight');

// User and Courses
User.hasMany(Course, { foreignKey: 'user_id' });
Course.belongsTo(User, { foreignKey: 'user_id' });

// Course and Student
Student.belongsToMany(Course, { through: 'StudentCourses', as: 'courses', foreignKey: 'student_id' });
Course.belongsToMany(Student, { through: 'StudentCourses', as: 'students', foreignKey: 'course_id' });

// Course and Tasks
Course.hasMany(Task, { foreignKey: 'course_id', as: 'tasks' });
Task.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Student and Attendance
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

// Course and Attendance
Course.hasMany(Attendance, { foreignKey: 'course_id', as: 'attendances' });
Attendance.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Task and Submissions
Task.hasMany(TaskSubmission, { foreignKey: 'task_id', as: 'submissions' });
TaskSubmission.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// Student and TaskSubmission
Student.hasMany(TaskSubmission, { foreignKey: 'student_id', as: 'submissions' });
TaskSubmission.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Course and GradeWeight
Course.hasMany(GradeWeight, { foreignKey: 'course_id', as: 'gradeWeights' });
GradeWeight.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });


module.exports = {
    User,
    Course,
    Student,
    Attendance,
    Task,
    TaskSubmission,
    GradeWeight,
};
