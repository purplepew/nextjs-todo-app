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
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/api/auth/logout',
                method: 'POST'
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled
                    dispatch(logout())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                        location.reload()
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const { useRefreshTokenMutation, useLogoutMutation } = authApiSlice

export default authApiSlice