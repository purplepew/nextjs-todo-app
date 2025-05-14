import { configureStore } from '@reduxjs/toolkit'
import apiSlice from './features/apiSlice'
import AuthReducer from './features/auth/authSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            [apiSlice.reducerPath]: apiSlice.reducer,
            auth: AuthReducer
        },
        middleware: defaultMiddleware => {
            return defaultMiddleware().concat(apiSlice.middleware)
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']