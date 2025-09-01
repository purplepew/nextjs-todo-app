import React, { Suspense } from 'react'
import NewTodoForm from './NewTodoForm'
import Skeleton from '@mui/material/Skeleton'
import TodoList from './TodoList'
import { Container, Paper } from '@mui/material'
import Header from '../Header'

const page = () => {
    return (
        <>
            <Header />
            <Container component={Paper} sx={{ minHeight: '100vh', padding: '1rem' }}>
                {/** The Suspense is needed for the url state management */}
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
            </Container >
        </>
    )
}

export default page