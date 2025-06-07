import useAuth from "@/app/components/hooks/useAuth";
import { useGetTodosQuery } from "@/app/lib/features/todo/todoApiSlice";
import { selectAllOfflineTodos, initializeTodo } from "@/app/lib/features/todo/todoSlice";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TodoCard from './TodoCard'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { RootState } from "@/app/lib/store";
import { ITodoDocument } from "@/app/lib/models/todoModel";


export default function TodoList() {
    const dispatch = useDispatch()
    const hasLoadedOfflineTodo = useRef(false)
    const offlineTodos = useSelector(selectAllOfflineTodos)
    const { id: userId } = useAuth()
    const { data, isLoading, isSuccess } = useGetTodosQuery({ userId: userId! }, {
        skip: !Boolean(userId),
        selectFromResult: ({ data, isLoading, isSuccess }) => ({ data, isLoading, isSuccess })
    })

    const isLoadingAuth = useSelector((state: RootState) => state.auth.isLoading)

    console.log('rerender')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const todos = JSON.parse(localStorage.getItem('todos') ?? '[]')
            dispatch(initializeTodo({ todos }))
            hasLoadedOfflineTodo.current = true
        }
    }, [dispatch])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('todos', JSON.stringify(offlineTodos))
        }
    }, [offlineTodos])

    const renderOfflineTodos = useMemo(() => {
        return offlineTodos?.map(todo => (
            <TodoCard title={todo.title} todoId={todo.id} completed={todo.completed} key={todo.id} createdAt={todo.createdAt} />
        ))
    }, [offlineTodos])

    const renderTodos = userId && data?.ids.map(todoId => {
        const todo = data.entities[todoId] as ITodoDocument & { isTemp: boolean }
        return <TodoCard title={todo.title} todoId={todo.id} completed={todo.completed} key={todo.id} userId={userId} isTemp={todo.isTemp} createdAt={todo.createdAt} />
    })

    const skeletons = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => i).map(i => {
            return (
                <Skeleton key={i} variant='rectangular' sx={{ borderRadius: 1, height: '2rem', minWidth: '20.5rem' }} />
            )
        })
    }, [])

    if (userId) {
        if (isLoading) {
            return skeletons
        } else if (isSuccess && renderTodos?.length) {
            return renderTodos
        } else {
            return <Typography>Empty.</Typography>
        }
    } else {
        if (hasLoadedOfflineTodo.current == false || isLoadingAuth) {
            return skeletons
        } else if (renderOfflineTodos?.length) {
            return renderOfflineTodos
        } else {
            return <Typography>Empty.</Typography>
        }
    }

}