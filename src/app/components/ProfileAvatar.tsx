"use client"
import React, { useCallback, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import { useLogoutMutation } from '../lib/features/auth/authApiSlice'

type Props = {
    picture: string,
    name: string
}

const ProfileAvatar = ({ picture, name }: Props) => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)
    const open = Boolean(anchorEl)

    const [logout] = useLogoutMutation()

    const handleLogout = useCallback(async () => {

        try {
            await logout().unwrap()
        } catch (error) {
            console.log(error)
        }
    }, [logout])

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
    }, [])

    return (
        <>
            <IconButton onClick={handleOpen}>
                <Avatar src={picture} alt={name} />
            </IconButton>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                <List dense>
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