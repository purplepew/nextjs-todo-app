import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const errorSlice = createSlice({
    name: 'error',
    initialState: { message: null } as { message: null | string },
    reducers: {
        setError: (state, action: { payload: { message: string } }) => {
            if (action.payload.message) {
                state.message = action.payload.message
            }
        },
        unsetError: (state) => {
            state.message = null
        }
    }
})

export const { setError, unsetError } = errorSlice.actions

export const selectCurrentErrorMessage = (state: RootState) => state.error.message 

export default errorSlice.reducer