import React from 'react'
import Modal from '@mui/material/Modal'
import { Box } from '@mui/material'

type Props = {}

const ProfileSettingsModal = (props: Props) => {
  return (
    <Modal open={true}>
        <Box sx={{height: '20rem', width: '20rem', backgroundColor: 'grey'}}>

        </Box>
    </Modal>
  )
}

export default ProfileSettingsModal