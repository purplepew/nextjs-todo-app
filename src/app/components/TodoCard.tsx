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

function TodoCard(
    { title, userId, todoId, completed = false, isTemp = false }:
        { title: string, userId?: string, todoId: string, completed?: boolean, isTemp?: boolean }
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

    const DeleteComponent = () => {
        return (
            <IconButton aria-label='delete todo' disabled={isTemp} onClick={handleDeleteTodo} sx={{ '&:hover': { backgroundColor: 'firebrick' } }}>
                <DeleteIcon />
            </IconButton>
        )
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
                    <DeleteComponent />
                    <CheckComponent />
                </div>

            </Box>
        </div>
    )
}

const memoized = memo(TodoCard)

export default memoized