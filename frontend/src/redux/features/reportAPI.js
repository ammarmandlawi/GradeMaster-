import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const reportAPI = createApi({
    reducerPath: "reportAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getReport: builder.query({
            query() {
                return {
                    url: "/report",
                    credentials: "include",
                };
            },
            transformResponse: (result) => result,
        }),
    }),
});

export const {
    useGetReportQuery,
} = reportAPI
