'use client'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import UndoIcon from '@mui/icons-material/Undo'
import { useCheckTodoMutation, useDeleteTodoMutation } from '@/app/lib/features/todo/todoApiSlice'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { checkTodoOffline, removeTodoOffline } from '@/app/lib/features/todo/todoSlice'

function TodoCard(
    { title, userId, todoId, completed = false, isTemp = false }:
        { title: string, userId?: string, todoId: string, completed?: boolean, isTemp?: boolean }
) {
    const [deleteTodo] = useDeleteTodoMutation()
    const [checkTodo] = useCheckTodoMutation()
    const dispatch = useDispatch()

    const handleDeleteTodo = async () => {
        if (userId) {
            try {
                await deleteTodo({ todoId, userId }).unwrap()
            } catch (error) {
                console.log(error)
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
                console.log(error)
            }
        } else {
            dispatch(checkTodoOffline({ id: todoId, completed }))
        }
    }

    const CheckComponent = () => {
        return !completed
            ? (
                <IconButton onClick={handleCheckTodo} disabled={isTemp}>
                    <CheckIcon color='primary' />
                </IconButton>
            )
            : (
                    <IconButton onClick={handleCheckTodo} disabled={isTemp}>
                        <UndoIcon color='error' />
                    </IconButton>
            )
    }

    const DeleteComponent = () => {
        return (
            <IconButton disabled={isTemp} onClick={handleDeleteTodo} sx={{ '&:hover': { backgroundColor: 'firebrick' } }}>
                <DeleteIcon />
            </IconButton>
        )
    }

    if (!title || !todoId) return null

    return (
        <div>
            <Box component={Paper} elevation={4} sx={{ minWidth: '20.5rem', display: 'grid', gridTemplateColumns: '1fr .1fr', alignItems: 'center', padding: '0 .5rem' }}>
                <Typography
                    sx={{
                        minWidth: '15rem',
                        textDecoration: completed ? 'line-through' : 'none',
                        color: !completed ? 'rgba(225,225,225, 1)' : 'rgba(225,225,225, .2)',
                        overflowX: 'hidden'
                    }}
                >
                    {title}
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', minWidth: '5rem' }}>
                    <DeleteComponent />
                    <CheckComponent />
                </div>

            </Box>
        </div>
    )
}

const memoized = memo(TodoCard)

export default memoized