'use client'
import React, { Suspense } from 'react'
import NewTodoForm from './components/NewTodoForm'
import Skeleton from '@mui/material/Skeleton'
import dynamic from 'next/dynamic'
const TodoList = dynamic(
  () => import('./components/TodoList'),
  {
    loading: () => (
      <>
        <Skeleton variant='rectangular' sx={{ borderRadius: 1, height: '2rem', minWidth: '20.5rem' }} />
        <Skeleton variant='rectangular' sx={{ borderRadius: 1, height: '2rem', minWidth: '20.5rem' }} />
        <Skeleton variant='rectangular' sx={{ borderRadius: 1, height: '2rem', minWidth: '20.5rem' }} />
      </>
    ),
    ssr: false
  }
)

const page = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading input field</p>}>
        <NewTodoForm />
      </Suspense>
      <div
        style={{
          margin: '0 auto',
          maxWidth: '500px',
          gap: 5,
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TodoList />
      </div>
    </div >
  )
}

export default page