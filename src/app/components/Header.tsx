'use client'
import { useAppSelector } from '../lib/hooks'
import { selectCurrentToken } from '../lib/features/auth/authSlice'
import { useLogoutMutation } from '../lib/features/auth/authApiSlice'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SignInButton from './SignInButton'

const Header = () => {
  const token = useAppSelector(selectCurrentToken)
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography component={'a'} href='/'>Header</Typography>
        <div style={{ marginLeft: 'auto' }}>
          {token ? <Button onClick={handleLogout}>Logout</Button> : <SignInButton />}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header