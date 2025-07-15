'use client'
import React, { Suspense } from 'react'
import NewTodoForm from './components/NewTodoForm'
import Skeleton from '@mui/material/Skeleton'
import dynamic from 'next/dynamic'

const skeletonProps = {
  borderRadius: 1,
  height: '2rem',
  minWidth: '20.5rem'
}

const TodoList = dynamic(
  () => import('./components/TodoList'),
  {
    loading: () => (
      <>
        <Skeleton variant='rectangular' sx={{ ...skeletonProps }} />
        <Skeleton variant='rectangular' sx={{ ...skeletonProps }} />
        <Skeleton variant='rectangular' sx={{ ...skeletonProps }} />
      </>
    ),
    ssr: false
  }
)

const page = () => {
  return (
    <div>

      <Suspense
        fallback={
          <div style={{ display: 'grid', margin: '0 auto', maxWidth: '500px', gap: 3, gridTemplateColumns: '1fr .25fr' }}>
            <Skeleton sx={{ height: '4rem' }} />
            <Skeleton sx={{ height: '4rem' }} />
          </div>
        }
      >
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