import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store';
import { setCredentials } from './auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        
        return headers
    }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseQueryWithReauth = async (args: string, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions) as { data?: { message: string }, status?: number, error?: { status: number } }
    
    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery('/api/auth/refresh', api, extraOptions) as { data: { message?: string, accessToken?: string }, status: number }
        console.log('Refreshing token')
        if (refreshResult.data) {
            const { accessToken } = refreshResult.data as { accessToken: string }
            api.dispatch(setCredentials({ accessToken }))

            result = await baseQuery(args, api, extraOptions) as { data?: { message: string }, status?: number }
        } else {
            if (refreshResult.status === 401) {
                (refreshResult.data as { message?: string }).message = "Your login has expired."
            }
            return refreshResult
        }
    }
    return result
}



const apiSlice = createApi({
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    endpoints: () => ({}),
    tagTypes: ['Todos']
})

export default apiSlice