import { ReactNode, useEffect } from 'react'
import todoApiSlice from '../todo/todoApiSlice'
import useAuth from '@/app/hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../../store'
import { selectCurrentToken } from './authSlice'

const Prefetch = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>()
    const token = useSelector(selectCurrentToken)
    const { id } = useAuth()

    useEffect(() => {
        if (token) {
            dispatch(todoApiSlice.util.prefetch('getTodos', { userId: id! }, { force: true }))
        }
    }, [dispatch, id, token])

    return (
        <>{children}</>
    )
}

export default Prefetch