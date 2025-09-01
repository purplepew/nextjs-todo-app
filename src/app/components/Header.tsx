'use client'
import { useAppSelector } from '../lib/hooks'
import { selectCurrentToken } from '../lib/features/auth/authSlice'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useAuth from '../hooks/useAuth'
import dynamic from 'next/dynamic'
import { Skeleton } from '@mui/material'
const SignInButton = dynamic(() => import('./SignInButton'))
const ProfileAvatar = dynamic(() => import('./ProfileAvatar'))

const Header = () => {
  const token = useAppSelector(selectCurrentToken)
  const { picture, name } = useAuth()
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography component={'a'} href='/'>Todo</Typography>
        <div style={{ marginLeft: 'auto' }}>
          {!token && <SignInButton />}
          {token && picture && name && <ProfileAvatar name={name} picture={picture} />}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export const HeaderSkeleton = () => (
  <Skeleton
    variant='rectangular'
    height={60}
    width={'100%'}
  />
)

export default Header