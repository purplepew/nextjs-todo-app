import { ReactNode, useEffect } from "react"
import { useAppSelector } from "../../hooks"
import { useRefreshTokenMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"
import Link from "next/link"
import PulseLoader from 'react-spinners/PulseLoader'

const PersistLogin = ({ children }: { children: ReactNode }) => {
    const token = useAppSelector(selectCurrentToken)
    const [refresh, { isLoading, isSuccess, isError }] = useRefreshTokenMutation()

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {
                console.log(error)
            }
        }

        if (!token) verifyRefreshToken()
    }, [])

    let content: ReactNode

    if (isLoading) {
        content = (
            <PulseLoader color='#fff'
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />
        )
    } else if (isSuccess) {
        content = (<>{children}</>)
    } else if (isError) {
        content = (
            <Link href={localStorage.getItem('linkGoogleSignIn') || '#'} style={{ textDecoration: 'underline' }}>
                Log in first bro.
            </Link>
        )
    }

    return content
}

export default PersistLogin