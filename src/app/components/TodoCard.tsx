'use client'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import UndoIcon from '@mui/icons-material/Undo'
import { useCheckTodoMutation, useDeleteTodoMutation } from '@/app/lib/features/todo/todoApiSlice'
import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { checkTodoOffline, removeTodoOffline } from '@/app/lib/features/todo/todoSlice'
import { Skeleton } from '@mui/material'
import { ApiResponse } from '../lib/types'

function CheckComponent({ completed, handleCheckTodo, isTemp }: { completed: boolean, handleCheckTodo: () => void, isTemp: boolean }) {
    return !completed
        ? (
            <IconButton aria-label='check todo' onClick={handleCheckTodo} disabled={isTemp}>
                <CheckIcon color='primary' />
            </IconButton>
        )
        : (
            <IconButton aria-label='uncheck todo' onClick={handleCheckTodo} disabled={isTemp}>
                <UndoIcon color='error' />
            </IconButton>
        )
}

function DeleteComponent({ handleDeleteTodo, isTemp }: { handleDeleteTodo: () => void, isTemp: boolean }) {
    return (
        <IconButton aria-label='delete todo' disabled={isTemp} onClick={handleDeleteTodo} sx={{ '&:hover': { backgroundColor: 'firebrick' } }}>
            <DeleteIcon />
        </IconButton>
    )
}

function TodoCard(
    { title, userId, todoId, completed = false, isTemp = false, throwError }:
        {
            title: string,
            userId?: string,
            todoId: string,
            completed?: boolean,
            isTemp?: boolean,
            throwError?: (message: string) => void
        }
) {
    const [open, setOpen] = useState(false)
    const [deleteTodo] = useDeleteTodoMutation()
    const [checkTodo] = useCheckTodoMutation()
    const dispatch = useDispatch()
    const hasLongTitle: boolean = title.length > 50 ? true : false

    const handleDeleteTodo = async () => {
        if (userId) {
            try {
                await deleteTodo({ todoId, userId }).unwrap()
            } catch (error) {
                const err = error as unknown as ApiResponse
                const message = err.status == 401 ? 'Please log in.' : err?.data?.message ?? err.message
                if (throwError) throwError(message)
            }
        } else {
            dispatch(removeTodoOffline({ id: todoId }))
        }
    }

    const handleCheckTodo = async () => {
        if (userId) {
            try {
                await checkTodo({ todoId, userId }).unwrap()
            } catch (error) {
                const err = error as unknown as ApiResponse
                const message = err.status == 401 ? 'Please log in.' : err?.data?.message ?? err.message
                if (throwError) throwError(message)
            }
        } else {
            dispatch(checkTodoOffline({ id: todoId, completed }))
        }
    }


    const handleToggleOpen = () => {
        if (title.length > 50) {
            setOpen(!open)
        }
    }

    if (!title || !todoId) return null

    return (
        <div>
            <Box component={Paper} elevation={4}
                sx={{
                    minWidth: '20.5rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr .1fr',
                    alignItems: 'center',
                    padding: '0 .5rem'
                }}
            >

                <Collapse in={open} collapsedSize={23} onClick={handleToggleOpen}>
                    <Typography
                        sx={{
                            minWidth: '15rem',
                            maxWidth: '25rem',
                            textDecoration: completed ? 'line-through' : 'none',
                            color: !completed ? 'rgba(225,225,225, 1)' : 'rgba(225,225,225, .2)',
                            maxHeight: '20rem',
                            overflowX: 'auto',
                            cursor: hasLongTitle ? 'pointer' : 'auto',

                        }}
                        noWrap={!open ? true : false}
                        aria-label='todo title'
                    >
                        {title}
                    </Typography>
                </Collapse>

                <div style={{ display: 'flex', alignItems: 'center', minWidth: '5rem' }}>
                    <DeleteComponent handleDeleteTodo={handleDeleteTodo} isTemp={isTemp} />
                    <CheckComponent completed={completed} handleCheckTodo={handleCheckTodo} isTemp={isTemp} />
                </div>

            </Box>
        </div>
    )
}


const memoized = memo(TodoCard)

export default memoized

export function TodoSkeleton() {
    return (
        <Skeleton variant='rectangular' sx={{ borderRadius: 1, height: '2rem', minWidth: '20.5rem' }} />
    )
}