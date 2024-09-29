import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";
import { removeToken, removeUserData } from "../../helper/helper";
import { logout } from "./userSlice";

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        logoutUser: builder.mutation({
            query() {
                return {
                    url: '/users/logout',
                    credentials: 'include',
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    removeToken();
                    removeUserData();
                    dispatch(logout());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    }),
});

export const {
    useLogoutUserMutation
} = userAPI
