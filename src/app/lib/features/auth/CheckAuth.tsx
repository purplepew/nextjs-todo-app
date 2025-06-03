import { ReactNode, useEffect } from "react"
import { useAppSelector } from "../../hooks"
import { useRefreshTokenMutation } from "./authApiSlice"
import { selectCurrentToken, setIsLoading } from "./authSlice"
import { useDispatch } from "react-redux"

const CheckAuth = ({ children }: { children: ReactNode }) => {
    const token = useAppSelector(selectCurrentToken)
    const [refresh] = useRefreshTokenMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                dispatch(setIsLoading(true))
                await refresh()
                dispatch(setIsLoading(false))
            } catch (error) {
                console.log(error)
                localStorage.setItem('isLoggedIn', 'false')
            }
        }

        if (!token) verifyRefreshToken()
    }, [token, refresh, dispatch])

    return <>{children}</>
}

export default CheckAuth