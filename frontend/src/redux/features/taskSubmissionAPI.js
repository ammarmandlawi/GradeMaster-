import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const taskSubmissionAPI = createApi({
    reducerPath: "taskSubmissionAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["TaskSubmissions"],
    endpoints: (builder) => ({
        createTaskSubmission: builder.mutation({
            query(taskSubmission) {
                return {
                    url: '/taskSubmissions/create',
                    method: 'POST',
                    credentials: 'include',
                    body: taskSubmission,
                };
            },
            invalidatesTags: [{ type: 'TaskSubmissions', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateTaskSubmission: builder.mutation({
            query({ id, taskSubmission }) {
                return {
                    url: `/taskSubmissions/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: taskSubmission,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'TaskSubmissions', id },
                        { type: 'TaskSubmissions', id: 'LIST' },
                    ]
                    : [{ type: 'TaskSubmissions', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getTaskSubmission: builder.query({
            query(id) {
                return {
                    url: `/taskSubmissions/getOneTaskSubmission/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'TaskSubmissions', id }],
        }),
        getTaskSubmissions: builder.query({
            query(args) {
                return {
                    url: `/taskSubmissions`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'TaskSubmissions',
                            id,
                        })),
                        { type: 'TaskSubmissions', id: 'LIST' },
                    ]
                    : [{ type: 'TaskSubmissions', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        deleteTaskSubmission: builder.mutation({
            query(id) {
                return {
                    url: `/taskSubmissions/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'TaskSubmissions', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTaskSubmissionQuery,
    useGetTaskSubmissionsQuery,
    useCreateTaskSubmissionMutation,
    useUpdateTaskSubmissionMutation,
    useDeleteTaskSubmissionMutation
} = taskSubmissionAPI
