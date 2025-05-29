import React, { useCallback, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import SettingsIcon from '@mui/icons-material/Settings'

const ProfileSettingsModal = () => {
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const ModalMode = () => (
    <Modal open={open} component={Paper}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid #000',
        boxShadow: 24,
        p: 1,
      }}
    >
      <Box sx={{ height: '30rem', width: '30rem' }}>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal >
  )


  return (
    <>
      <ListItemButton onClick={handleOpen}>
        <ListItemIcon >
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText sx={{ whiteSpace: 'nowrap' }}>Profile Settings</ListItemText>
      </ListItemButton>
      
      <ModalMode />
    </>
  )

}
export default ProfileSettingsModal