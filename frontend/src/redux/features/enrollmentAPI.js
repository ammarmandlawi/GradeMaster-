import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const enrollmentAPI = createApi({
    reducerPath: "enrollmentAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Enrollments"],
    endpoints: (builder) => ({
        getEnrollments: builder.query({
            query() {
                return {
                    url: "/enrollments",
                    credentials: "include",
                };
            },
            transformResponse: (result) => result,
        }),
        createEnrollment: builder.mutation({
            query(course) {
                return {
                    url: '/enrollments/create',
                    method: 'POST',
                    credentials: 'include',
                    body: course,
                };
            },
            invalidatesTags: [{ type: 'Enrollments', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateEnrollment: builder.mutation({
            query({ id, course }) {
                return {
                    url: `/enrollments/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: course,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Enrollments', id },
                        { type: 'Enrollments', id: 'LIST' },
                    ]
                    : [{ type: 'Enrollments', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getEnrollment: builder.query({
            query(id) {
                return {
                    url: `/enrollments/getOneEnrollment/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Enrollments', id }],
        }),
        deleteEnrollment: builder.mutation({
            query(id) {
                return {
                    url: `/students/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Students', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetEnrollmentsQuery,
    useGetEnrollmentQuery,
    useDeleteEnrollmentMutation,
    useCreateEnrollmentMutation,
    useUpdateEnrollmentMutation,
} = enrollmentAPI
