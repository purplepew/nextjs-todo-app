import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import SignInButton from './SignInButton'
import { useLogoutMutation } from '../lib/features/auth/authApiSlice'

type Props = {}


const ProfileAvatar = (props: Props) => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)
    const open = Boolean(anchorEl)

    const [logout] = useLogoutMutation()

    const handleLogout = async () => {

        try {
            await logout().unwrap()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
    }

    return (
        <>
            <IconButton onClick={handleOpen}>
                <Avatar src='' />
            </IconButton>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                <List dense>
                    <ListItemButton>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText sx={{whiteSpace: 'nowrap'}}>Profile Settings</ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon color='error' />
                        </ListItemIcon>
                        <ListItemText>Log out</ListItemText>
                    </ListItemButton>
                </List>
            </Menu>
        </>
    )
}

export default ProfileAvatar