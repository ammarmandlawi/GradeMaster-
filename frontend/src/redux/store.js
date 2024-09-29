import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import userReducer from './features/userSlice';
import { authAPI } from './features/authAPI';
import { getMeAPI } from './features/getMeAPI';
import { userAPI } from './features/userAPI';
import { courseAPI } from './features/courseAPI';
import { studentAPI } from './features/studentAPI';
import { attendanceAPI } from './features/attendanceAPI';
import { taskAPI } from './features/taskAPI';
import { taskSubmissionAPI } from './features/taskSubmissionAPI';
import { gradeWeightAPI } from './features/gradeWeightAPI';
import { reportAPI } from './features/reportAPI';
import { enrollmentAPI } from './features/enrollmentAPI';

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [getMeAPI.reducerPath]: getMeAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
    [studentAPI.reducerPath]: studentAPI.reducer,
    [taskAPI.reducerPath]: taskAPI.reducer,
    [taskSubmissionAPI.reducerPath]: taskSubmissionAPI.reducer,
    [attendanceAPI.reducerPath]: attendanceAPI.reducer,
    [gradeWeightAPI.reducerPath]: gradeWeightAPI.reducer,
    [reportAPI.reducerPath]: reportAPI.reducer,
    [enrollmentAPI.reducerPath]: enrollmentAPI.reducer,
    userState: userReducer
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
        authAPI.middleware,
        getMeAPI.middleware,
        userAPI.middleware,
        courseAPI.middleware,
        studentAPI.middleware,
        attendanceAPI.middleware,
        taskAPI.middleware,
        taskSubmissionAPI.middleware,
        gradeWeightAPI.middleware,
        reportAPI.middleware,
        enrollmentAPI.middleware,
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
