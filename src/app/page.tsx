import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from 'next/link'

const page = () => {
  return (
    <>
      <h1>Home</h1>
      <List>
        <ListItem>
          <Link href='/todo'>Todo app</Link>
        </ListItem>
      </List>
    </>
  )
}

export default page