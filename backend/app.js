const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskSubmissionRoutes = require('./routes/taskSubmissionRoutes');
const gradeWeightRoutes = require('./routes/gradeWeightRoutes');
const reportRoutes = require('./routes/reportRoutes');
const sequelize = require('./config/database');

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:5050'
        ],
    }),
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/taskSubmissions', taskSubmissionRoutes);
app.use('/api/gradeWeights', gradeWeightRoutes);
app.use('/api/report', reportRoutes);

sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });

module.exports = app;
