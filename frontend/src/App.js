/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import RequiredUser from './components/RequiredUser';
import Layout from './components/Layout';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserData } from './helper/helper';
import Register from './pages/auth/Register';
import Courses from './pages/course/Courses';
import FullScreenLoader from './components/FullScreenLoader'; // Add a fallback loader
import CreateCourse from './pages/course/CreateCourse';
import UpdateCourse from './pages/course/UpdateCourse';
import Students from './pages/student/Students';
import CreateStudent from './pages/student/CreateStudent';
import UpdateStudent from './pages/student/UpdateStudent';
import Attendances from './pages/attendance/Attendances';
import CreateAttendance from './pages/attendance/CreateAttendance';
import UpdateAttendance from './pages/attendance/UpdateAttendance';
import Tasks from './pages/task/Tasks';
import CreateTask from './pages/task/CreateTask';
import UpdateTask from './pages/task/UpdateTask';
import TaskSubmissions from './pages/taskSubmission/TaskSubmissions';
import CreateTaskSubmission from './pages/taskSubmission/CreateTaskSubmission';
import UpdateTaskSubmission from './pages/taskSubmission/UpdateTaskSubmission';
import GradeWeights from './pages/grade/GradeWeights'; // New GradeWeight component
import CreateGradeWeight from './pages/grade/CreateGradeWeight'; // New GradeWeight create component
import UpdateGradeWeight from './pages/grade/UpdateGradeWeight'; // New GradeWeight update component
import Report from './pages/report/Report';
import Enrollments from './pages/enrollment/Enrollment';
import CreateEnrollment from './pages/enrollment/CreateEnrollment';
import UpdateEnrollment from './pages/enrollment/UpdateEnrollment';

const App = () => {
  const getHomeRoute = () => {
    const user = getUserData(); // Check if the user is logged in
    if (user) {
      return <Navigate to="/courses" replace />; // Redirect to courses if authenticated
    } else {
      return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }
  };

  return (
    <Suspense fallback={<FullScreenLoader />}> {/* Added a fallback loader for lazy loading */}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default route depending on user authentication */}
          <Route index element={getHomeRoute()} />

          {/* Protected route: Requires the user to be logged in */}
          <Route element={<RequiredUser />}>
            <Route path="courses" element={<Courses />} />
            <Route path="courses/create-course" element={<CreateCourse />} />
            <Route path="courses/update-course/:id" element={<UpdateCourse />} />
            <Route path="students" element={<Students />} />
            <Route path="students/create-student" element={<CreateStudent />} />
            <Route path="students/update-student/:id" element={<UpdateStudent />} />
            <Route path="attendances" element={<Attendances />} />
            <Route path="attendances/create-attendance" element={<CreateAttendance />} />
            <Route path="attendances/update-attendance/:id" element={<UpdateAttendance />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="enrollments/create-enrollment" element={<CreateEnrollment />} />
            <Route path="enrollments/update-enrollment/:id" element={<UpdateEnrollment />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/create-task" element={<CreateTask />} />
            <Route path="tasks/update-task/:id" element={<UpdateTask />} />
            <Route path="taskSubmissions" element={<TaskSubmissions />} />
            <Route path="taskSubmissions/create-taskSubmission" element={<CreateTaskSubmission />} />
            <Route path="taskSubmissions/update-taskSubmission/:id" element={<UpdateTaskSubmission />} />
            <Route path="gradeWeights" element={<GradeWeights />} />
            <Route path="gradeWeights/create-gradeWeight" element={<CreateGradeWeight />} />
            <Route path="gradeWeights/update-gradeWeight/:id" element={<UpdateGradeWeight />} />
            <Route path="report" element={<Report />} />
          </Route>
        </Route>

        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </Suspense>
  );
};

export default App;
