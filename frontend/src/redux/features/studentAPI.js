import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const studentAPI = createApi({
    reducerPath: "studentAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Students"],
    endpoints: (builder) => ({
        createStudent: builder.mutation({
            query(student) {
                return {
                    url: '/students/create',
                    method: 'POST',
                    credentials: 'include',
                    body: student,
                };
            },
            invalidatesTags: [{ type: 'Students', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateStudent: builder.mutation({
            query({ id, student }) {
                return {
                    url: `/students/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: student,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Students', id },
                        { type: 'Students', id: 'LIST' },
                    ]
                    : [{ type: 'Students', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getStudent: builder.query({
            query(id) {
                return {
                    url: `/students/getOneStudent/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Students', id }],
        }),
        getStudents: builder.query({
            query(args) {
                return {
                    url: `/students`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Students',
                            id,
                        })),
                        { type: 'Students', id: 'LIST' },
                    ]
                    : [{ type: 'Students', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        deleteStudent: builder.mutation({
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
    useGetStudentQuery,
    useGetStudentsQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation
} = studentAPI
