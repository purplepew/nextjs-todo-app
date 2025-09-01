import React, { Suspense } from 'react'
import NewTodoForm from './components/online/NewTodoForm'
import TodoListOnline from './components/online/TodoList'
import { NewTodoFormSkeleton } from './components/online/NewTodoForm'

const page = () => {

  return (
    <div>
      {/** The Suspense is needed for the url state management */}
      <Suspense
        fallback={<NewTodoFormSkeleton />}
      >
        < NewTodoForm />
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
        <TodoListOnline />
      </div>
    </div >
  )
}

export default page