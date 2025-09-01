'use client'
import useAuth from "@/app/hooks/useAuth"
import { useGetTodosQuery } from "@/app/lib/features/todo/todoApiSlice"
import TodoCard from '../TodoCard'
import Typography from '@mui/material/Typography'
import { ITodoDocument } from "@/app/lib/models/todoModel"
import { TodoSkeleton } from "../TodoCard"
import { useCallback, useState } from "react"
import { Snackbar } from "@mui/material"

export default function TodoList() {
    const { id: userId } = useAuth()
    const [errMsg, setErrMsg] = useState('')

    const throwError = useCallback((message: string) => {
        setErrMsg(message)
    }, [setErrMsg])

    const { data, isLoading, isSuccess } = useGetTodosQuery({ userId: userId! }, {
        skip: !Boolean(userId),
        selectFromResult: ({ data, isLoading, isSuccess }) => ({ data, isLoading, isSuccess })
    })

    const renderTodos = userId && data?.ids.map(todoId => {
        const todo = data.entities[todoId] as ITodoDocument & { isTemp: boolean }
        if (!todo) return null

        return (
            <TodoCard
                title={todo.title}
                todoId={todo.id}
                completed={todo.completed}
                key={todo.id}
                userId={userId}
                isTemp={todo.isTemp}
                throwError={throwError}
            />
        )
    })

    // FOR THE TODO WITH ACCOUNT
    if (isLoading) {
        return (
            <>
                <TodoSkeleton />
                <TodoSkeleton />
                <TodoSkeleton />
            </>
        )
    } else if (isSuccess && renderTodos?.length) {
        return (
            <>
                {renderTodos}
                <Snackbar
                    aria-label='error popup'
                    autoHideDuration={5000}
                    message={errMsg}
                    open={Boolean(errMsg)}
                    onClose={() => setErrMsg('')}
                />
            </>
        )
    } else {
        return <Typography>Empty.</Typography>
    }
}