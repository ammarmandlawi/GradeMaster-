import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const taskAPI = createApi({
    reducerPath: "taskAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Tasks"],
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query(task) {
                return {
                    url: '/tasks/create',
                    method: 'POST',
                    credentials: 'include',
                    body: task,
                };
            },
            invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateTask: builder.mutation({
            query({ id, task }) {
                return {
                    url: `/tasks/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: task,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Tasks', id },
                        { type: 'Tasks', id: 'LIST' },
                    ]
                    : [{ type: 'Tasks', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getTask: builder.query({
            query(id) {
                return {
                    url: `/tasks/getOneTask/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
        }),
        getTasks: builder.query({
            query(args) {
                return {
                    url: `/tasks`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Tasks',
                            id,
                        })),
                        { type: 'Tasks', id: 'LIST' },
                    ]
                    : [{ type: 'Tasks', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        deleteTask: builder.mutation({
            query(id) {
                return {
                    url: `/tasks/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetTaskQuery,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation
} = taskAPI
