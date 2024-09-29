import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const gradeWeightAPI = createApi({
    reducerPath: "gradeWeightAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["GradeWeights"],
    endpoints: (builder) => ({
        createGradeWeight: builder.mutation({
            query(gradeWeight) {
                return {
                    url: '/gradeWeights/create',
                    method: 'POST',
                    credentials: 'include',
                    body: gradeWeight,
                };
            },
            invalidatesTags: [{ type: 'GradeWeights', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateGradeWeight: builder.mutation({
            query({ id, gradeWeight }) {
                return {
                    url: `/gradeWeights/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: gradeWeight,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'GradeWeights', id },
                        { type: 'GradeWeights', id: 'LIST' },
                    ]
                    : [{ type: 'GradeWeights', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getGradeWeight: builder.query({
            query(id) {
                return {
                    url: `/gradeWeights/getOneGradeWeight/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'GradeWeights', id }],
        }),
        getGradeWeights: builder.query({
            query(args) {
                return {
                    url: `/gradeWeights`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'GradeWeights',
                            id,
                        })),
                        { type: 'GradeWeights', id: 'LIST' },
                    ]
                    : [{ type: 'GradeWeights', id: 'LIST' }],
            transformResponse: (results) => results,
        }),
        deleteGradeWeight: builder.mutation({
            query(id) {
                return {
                    url: `/gradeWeights/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'GradeWeights', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetGradeWeightQuery,
    useGetGradeWeightsQuery,
    useCreateGradeWeightMutation,
    useUpdateGradeWeightMutation,
    useDeleteGradeWeightMutation
} = gradeWeightAPI
