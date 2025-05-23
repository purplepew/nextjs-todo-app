import { ReactNode, useEffect } from 'react'
import todoApiSlice from '../todo/todoApiSlice'
import useAuth from '@/app/components/hooks/useAuth'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'

const Prefetch = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useAuth()

    useEffect(() => {
        dispatch(todoApiSlice.util.prefetch('getTodos', id!, { force: true }))
    }, [])

    return (
        <>{children}</>
    )
}

export default Prefetch