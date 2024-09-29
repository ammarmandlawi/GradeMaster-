import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const courseAPI = createApi({
    reducerPath: "courseAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Courses"],
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query(course) {
                return {
                    url: '/courses/create',
                    method: 'POST',
                    credentials: 'include',
                    body: course,
                };
            },
            invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateCourse: builder.mutation({
            query({ id, course }) {
                return {
                    url: `/courses/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: course,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Courses', id },
                        { type: 'Courses', id: 'LIST' },
                    ]
                    : [{ type: 'Courses', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getCourse: builder.query({
            query(id) {
                return {
                    url: `/courses/getOneCourse/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Courses', id }],
        }),
        getCourses: builder.query({
            query(args) {
                return {
                    url: `/courses`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Courses',
                            id,
                        })),
                        { type: 'Courses', id: 'LIST' },
                    ]
                    : [{ type: 'Courses', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        deleteCourse: builder.mutation({
            query(id) {
                return {
                    url: `/courses/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCourseQuery,
    useGetCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation
} = courseAPI
