import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, isLoading: false } as { token: string | null, isLoading: boolean },
    reducers: {
        setCredentials: (state, action: { payload: { accessToken: string | null } }) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logout: (state) => {
            state.token = null
        },
        setIsLoading: (state, action: { payload: boolean }) => {
            state.isLoading = action.payload
        }
    },
})

export const { setCredentials, logout, setIsLoading } = authSlice.actions

export const selectCurrentToken = (state: RootState) => state.auth.token

export default authSlice.reducer
