import React from 'react'
import { NewTodoFormSkeleton } from './components/online/NewTodoForm'
import { TodoSkeleton } from './components/TodoCard'
import { HeaderSkeleton } from './components/Header'
import { Container, Paper } from '@mui/material'

export default function Loading() {
    return (
        <>
            <HeaderSkeleton />

            <Container component={Paper} sx={{ minHeight: '100vh', padding: '1rem' }}>
                <NewTodoFormSkeleton />
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
                    <TodoSkeleton />
                    <TodoSkeleton />
                    <TodoSkeleton />
                </div>
            </Container>
        </>
    )
}
