'use client'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import UndoIcon from '@mui/icons-material/Undo'
import { useCheckTodoMutation, useDeleteTodoMutation } from '@/app/lib/features/todo/todoApiSlice'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { checkTodoOffline, removeTodoOffline } from '@/app/lib/features/todo/todoSlice'

const TodoCard = (
    { title, userId, todoId, completed = false, isTemp = false }:
        { title: string, userId?: string, todoId: string, completed?: boolean, isTemp?: boolean }
) => {
    const [deleteTodo] = useDeleteTodoMutation()
    const [checkTodo] = useCheckTodoMutation()
    const dispatch = useDispatch()

    const handleDeleteTodo = async () => {
        if (userId) {
            try {
                const response = await deleteTodo({ todoId, userId }).unwrap()
                console.log(response)
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
                const response = await checkTodo({ todoId, userId }).unwrap()
                console.log(response)
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
                    <CheckIcon color='success' />
                </IconButton>
            )
            : (
                <Tooltip title='undo'>
                    <IconButton onClick={handleCheckTodo} disabled={isTemp}>
                        <UndoIcon color='error' />
                    </IconButton>
                </Tooltip>
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
            <Box component={Paper} elevation={4} sx={{ display: 'grid', gridTemplateColumns: '1fr .1fr', alignItems: 'center', padding: '0 .5rem' }}>
                <Typography
                    sx={{
                        maxWidth: '23rem',
                        minWidth: '15rem',
                        textDecoration: completed ? 'line-through' : 'none',
                        color: !completed ? 'rgba(225,225,225, 1)' : 'rgba(225,225,225, .2)',
                    }}
                >
                    {title}
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', minWidth: '5rem'}}>
                    <DeleteComponent />
                    <CheckComponent />
                </div>
            </Box>
        </div>
    )
}

const memoized = memo(TodoCard)

export default memoized