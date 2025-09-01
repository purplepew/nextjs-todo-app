import apiSlice from "../apiSlice";
import { logout, setCredentials } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        refreshToken: builder.mutation<{ accessToken: string }, void>({
            query: () => ({
                url: '/api/auth/refresh',
                method: 'GET',
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch {}
            }
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/api/auth/logout',
                method: 'POST'
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled
                    dispatch(logout())
                    dispatch(apiSlice.util.resetApiState())
                    localStorage.setItem('isLoggedIn', 'false')
                    location.reload()
                } catch {}
            }
        })
    })
})

export const { useRefreshTokenMutation, useLogoutMutation } = authApiSlice

export default authApiSlice