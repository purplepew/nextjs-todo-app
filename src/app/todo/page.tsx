'use client'
import useAuth from '../components/hooks/useAuth'
import NewTodoForm from './components/NewTodoForm'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useGetTodosQuery } from '../lib/features/todo/todoApiSlice'
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import TodoCard from './components/TodoCard';
import { ITodoDocument } from '../lib/models/todoModel';
import { useDispatch, useSelector } from 'react-redux';
import { ITodoOffline, selectAll, initializeTodo } from '../lib/features/todo/todoSlice';

const Page = () => {
    const dispatch = useDispatch()
    const { id: userId } = useAuth()
    const hasLoadedLocalTodoRef = useRef(false)

    const { data, isSuccess, isError, isLoading } = useGetTodosQuery({ userId: userId! }, {
        selectFromResult: ({ data, isSuccess, isError, isLoading }) => ({ data, isSuccess, isError, isLoading }),
        skip: !userId
    })

    useEffect(() => {
        if (!userId) {
            const localStorageTodos: ITodoOffline[] = JSON.parse(localStorage.getItem('todos') as string) ?? [];
            hasLoadedLocalTodoRef.current = true
            if (localStorageTodos.length > 0) {
                dispatch(initializeTodo({ todos: localStorageTodos }))
            }
        }
    }, [userId, dispatch])

    const offlineTodos = useSelector(selectAll)

    const SkeletonTodoCards = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => i).map(i => {
            return (
                <Skeleton key={i} variant='rectangular' sx={{ borderRadius: 1, height: '2rem', minWidth: '20.5rem' }} />
            )
        })
    }, [])

    let renderTodoCards: ReactNode = SkeletonTodoCards

    if (!userId) {
        //Offline mode
        if (hasLoadedLocalTodoRef.current) { // Save todos 
            localStorage.setItem('todos', JSON.stringify(offlineTodos))
        }

        if (offlineTodos.length > 0) {
            renderTodoCards = offlineTodos.map((todo: ITodoOffline) => {
                return (
                    <TodoCard title={todo.title} completed={todo.completed} todoId={todo.id} key={todo.id} />)
            })
        } else if (hasLoadedLocalTodoRef.current && offlineTodos.length < 1) {
            renderTodoCards = (<Typography>Empty.</Typography>)
        }

    } else if (isLoading) {
        renderTodoCards = SkeletonTodoCards
    } else if (isSuccess && data) {
        renderTodoCards = data.ids.map((todoId: string) => {

            const todo = data.entities[todoId] as ITodoDocument & { isTemp: boolean }

            return (
                <TodoCard
                    title={todo.title}
                    key={todoId}
                    todoId={todoId}
                    userId={userId}
                    completed={todo.completed}
                    isTemp={todo.isTemp}
                />
            )
        })
    } else if (isError) {
        renderTodoCards = (<p>Error occured</p>)
    }

    return (
        <div>
            {!userId && hasLoadedLocalTodoRef.current && <Typography color='primary' mb={1}>Offline Mode</Typography>}
            
            <NewTodoForm />

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

                {renderTodoCards}
            </div>
        </div>
    );
};

export default Page;
