'use client'
import { useAppSelector } from '../lib/hooks'
import { selectCurrentToken } from '../lib/features/auth/authSlice'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ProfileAvatar from './ProfileAvatar'
import SignInButton from './SignInButton'

const Header = () => {
  const token = useAppSelector(selectCurrentToken)
  
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography component={'a'} href='/'>Header</Typography>
        <div style={{ marginLeft: 'auto' }}>
          {!token && <SignInButton />}
          {token && <ProfileAvatar />}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header