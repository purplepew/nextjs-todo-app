'use client'
import useAuth from '../components/hooks/useAuth'
import NewTodoForm from './components/NewTodoForm'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useGetTodosQuery } from '../lib/features/todo/todoApiSlice'
import { useEffect, useMemo, useRef } from 'react';
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

    const isLoggedIn = useMemo(() => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
        }
        return false;
    }, []);

    useEffect(() => {
        if (!userId && typeof window !== 'undefined' && !hasLoadedLocalTodoRef.current) {
            const storedTodos: ITodoOffline[] = JSON.parse(localStorage.getItem('todos') || '[]');
            hasLoadedLocalTodoRef.current = true;

            if (storedTodos.length > 0) {
                dispatch(initializeTodo({ todos: storedTodos }));
            }
        }
    }, [userId, dispatch]);

    const offlineTodos = useSelector(selectAll)

    useEffect(() => {
        if (!userId && hasLoadedLocalTodoRef.current && typeof window !== 'undefined') {
            localStorage.setItem('todos', JSON.stringify(offlineTodos));
        }
    }, [offlineTodos, userId]);

    const skeletons = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => i).map(i => {
            return (
                <Skeleton key={i} variant='rectangular' sx={{ borderRadius: 1, height: '2rem', minWidth: '20.5rem' }} />
            )
        })
    }, [])

    const renderTodoCards = useMemo(() => {
        if (!userId && !isLoggedIn) {
            if (offlineTodos.length > 0) {
                return offlineTodos.map((todo) => (
                    <TodoCard key={todo.id} title={todo.title} completed={todo.completed} todoId={todo.id} />
                ));
            }
            return hasLoadedLocalTodoRef.current ? <Typography>Empty.</Typography> : skeletons;
        }

        if (isLoading) return skeletons;
        if (isError) return <Typography color="error">Error occurred</Typography>;

        if (isSuccess && data && userId) {
            return data.ids.map((todoId: string) => {
                const todo = data.entities[todoId] as ITodoDocument & { isTemp: boolean };
                return (
                    <TodoCard
                        key={todoId}
                        todoId={todoId}
                        title={todo.title}
                        completed={todo.completed}
                        userId={userId}
                        isTemp={todo.isTemp}
                    />
                );
            });
        }

        return skeletons;
    }, [userId, isLoggedIn, offlineTodos, isLoading, isError, isSuccess, data, skeletons]);


    return (
        <div>
            {(!userId && hasLoadedLocalTodoRef.current && !isLoggedIn) && <Typography color='primary' mb={1}>Offline Mode</Typography>}

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
