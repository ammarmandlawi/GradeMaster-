import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from "./defaultFetchBase";

export const attendanceAPI = createApi({
    reducerPath: 'attendanceAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ["Attendances"],
    endpoints: (builder) => ({
        getAttendanceRecords: builder.query({
            query(args) {
                return {
                    url: `/attendances`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Attendances',
                            id,
                        })),
                        { type: 'Attendances', id: 'LIST' },
                    ]
                    : [{ type: 'Attendances', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        getAttendance: builder.query({
            query(id) {
                return {
                    url: `/attendances/getOneAttendance/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Attendances', id }],
        }),
        createAttendance: builder.mutation({
            query(attendance) {
                return {
                    url: '/attendances/create',
                    method: 'POST',
                    credentials: 'include',
                    body: attendance,
                };
            },
            invalidatesTags: [{ type: 'Attendances', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateAttendance: builder.mutation({
            query: ({ id, attendance }) => ({
                url: `/attendances/update/${id}`,
                method: 'PUT',
                body: attendance,
            }),
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Attendances', id },
                        { type: 'Attendances', id: 'LIST' },
                    ]
                    : [{ type: 'Attendances', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        deleteAttendance: builder.mutation({
            query(id) {
                return {
                    url: `/attendances/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Attendances', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetAttendanceRecordsQuery,
    useGetAttendanceQuery,
    useCreateAttendanceMutation,
    useUpdateAttendanceMutation,
    useDeleteAttendanceMutation,
} = attendanceAPI;
