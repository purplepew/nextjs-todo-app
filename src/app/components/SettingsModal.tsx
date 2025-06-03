import React, { useCallback, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import SettingsIcon from '@mui/icons-material/Settings'

const ProfileSettingsModal = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState(0)

  const handleOpen = useCallback(() => setOpen(true), [])

  const handleOnChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

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
        opacity: .9,
      }}
    >
      <>
        <Tabs value={value} onChange={handleOnChange}>
          <Tab label='Profile' value={0} />
          <Tab label='Preference' value={1} />
          <Tab label='About' value={2} />
        </Tabs>
        {value == 0 &&
          <Box>
            <FormControlLabel control={<Checkbox defaultChecked />} label='Dark Theme' />
          </Box>}
        {value == 1 && <p>Preference</p>}
        {value == 2 && <p>About</p>}
      </>
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