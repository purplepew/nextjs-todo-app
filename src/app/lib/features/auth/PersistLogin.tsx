import { ReactNode, useEffect, useMemo} from "react"
import { useAppSelector } from "../../hooks"
import { useRefreshTokenMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import SignInButton from "@/app/components/SignInButton"

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
    }, [token, refresh])

    const LoadingAnimation = useMemo(() => (
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }}>
            <Typography>Hi! Please wait while we are getting everything ready for you{':)'}</Typography>
            <PulseLoader color='#fff' size={'1rem'} />
        </div>
    ), []
    )

    const LoginForm = useMemo(() => (
        <>
            <Typography>Log in first bro.</Typography>
            <Stack direction='column' gap={1} sx={{ maxWidth: '20rem' }}>
                <TextField label='Username' />
                <TextField label='Password' />
                <Button variant='contained'>Log in</Button>
                <SignInButton />
            </Stack>
        </>
    ), [])

    if (isLoading) return LoadingAnimation
    else if (isSuccess) return <>{children}</>
    else if(isError) return LoginForm
}

export default PersistLogin