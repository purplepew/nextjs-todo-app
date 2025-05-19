'use client'
import React, { ReactNode, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { selectCurrentErrorMessage, unsetError } from '../lib/features/error/errorSlice'
const Popup = ({ children }: { children: ReactNode }) => {

    const errMsg = useAppSelector(selectCurrentErrorMessage)
    const dispatch = useAppDispatch()

    useEffect(() => {
        let time: NodeJS.Timeout | undefined
        if (errMsg) {
            time = setTimeout(() => {
                dispatch(unsetError())
            }, 2000)
        }

        return () => {
            clearInterval(time)
        }
    }, [errMsg])

    return (
        <>
            {children}
            <Snackbar open={Boolean(errMsg)} autoHideDuration={3000} message={errMsg} />
        </>
    )
}

export default Popup