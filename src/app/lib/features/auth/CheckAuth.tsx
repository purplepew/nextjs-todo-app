import { ReactNode, useEffect, useState } from "react"
import { useAppSelector } from "../../hooks"
import { useRefreshTokenMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"
import { useDispatch } from "react-redux"
import OfflinePage from '@/app/components/offline/OfflinePage'
import Loading from '@/app/Loading'

const CheckAuth = ({ children }: { children: ReactNode }) => {
    const token = useAppSelector(selectCurrentToken)
    const [refresh] = useRefreshTokenMutation()
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh().unwrap()
                setIsLoading(false)
            } catch (e) {
                console.log('ERRPR', e)
                setIsError(true)
                setIsLoading(false)
            }
        }

        if (!token) verifyRefreshToken()

    }, [token, refresh, dispatch])

    if (isLoading) {
        return <Loading />
    } else if (isError) {
        return <OfflinePage />
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}

export default CheckAuth