'use client'
import React from 'react'
import NewTodoForm from './components/NewTodoForm'
import TodoList from './components/TodoList'

const page = () => {
  return (
    <div>
      <NewTodoForm />

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
    </div>
  )
}

export default page