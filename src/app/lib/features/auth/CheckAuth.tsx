import { ReactNode, useEffect } from "react"
import { useAppSelector } from "../../hooks"
import { useRefreshTokenMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"

const CheckAuth = ({ children }: { children: ReactNode }) => {
    const token = useAppSelector(selectCurrentToken)
    const [refresh] = useRefreshTokenMutation()

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {
                console.log(error)
            }
        }

        if (!token) verifyRefreshToken()
    }, [token, refresh])

    // const LoadingAnimation = useMemo(() => (
    //     <div style={{
    //         position: "absolute",
    //         top: "50%",
    //         left: "50%",
    //         transform: "translate(-50%, -50%)",
    //     }}>
    //         <Typography>Hi! Please wait while we are getting everything ready for you{':)'} And if you have read this far, and still waiting, might as well leave this slow website and proceed with your life</Typography>
    //         <PulseLoader color='#fff' size={'1rem'} />
    //     </div>
    // ), []
    // )
    
    return <>{children}</>
}

export default CheckAuth