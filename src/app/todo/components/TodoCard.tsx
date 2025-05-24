'use client'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { useCheckTodoMutation, useDeleteTodoMutation } from '@/app/lib/features/todo/todoApiSlice'
import { memo } from 'react'

const TodoCard = ({ title, userId, todoId, completed = false }: { title: string, userId: string, todoId: string, completed?: boolean }) => {

    const [deleteTodo] = useDeleteTodoMutation()
    const [checkTodo] = useCheckTodoMutation()

    const handleDeleteTodo = async () => {
        try {
            const response = await deleteTodo({todoId, userId}).unwrap()
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCheckTodo = async () => {
        try {
            const response = await checkTodo({todoId, userId}).unwrap()
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Box component={Paper} elevation={4} sx={{ display: 'grid', gridTemplateColumns: '1fr .1fr', alignItems: 'center', padding: '0 .5rem' }}>
                <Typography sx={{maxWidth: '23rem', textDecoration: completed ? 'line-through' : 'none'}}>{title}</Typography>
                <div style={{ display: 'flex' }}>
                    <IconButton onClick={handleDeleteTodo}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={handleCheckTodo}>
                        <CheckIcon />
                    </IconButton>
                </div>
            </Box>
        </div>
    )
}

const memoized = memo(TodoCard)

export default memoized