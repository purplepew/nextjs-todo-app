import React, { lazy, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google'

const SignInButton = () => {
    const [link, setLink] = useState<string | '#'>('#')

    useEffect(() => {
        const getGoogleSignInLink = async () => {
            await fetch('http://localhost:3000//api/auth/google/generateLink', { method: 'GET' })
                .then(response => response.json())
                .then(result => {
                    setLink(result)
                    localStorage.setItem('linkGoogleSignIn', result)
                })
        }
        const googleSignInLink = localStorage.getItem('linkGoogleSignIn')

        if (!googleSignInLink) getGoogleSignInLink()
        else setLink(googleSignInLink)

    }, [])

    if (link == '#') return null

    return (
        <Button
            startIcon={<GoogleIcon />}
            size='small'
            variant='contained'
            href={link}
            LinkComponent={'a'}
        >
            Sign In with Google
        </Button>
    )
}

export default SignInButton