'use client'
import useAuth from '../components/hooks/useAuth'
import NewTodoForm from './components/NewTodoForm'
import { useGetTodosQuery } from '../lib/features/todo/todoApiSlice'
import { ReactNode } from 'react';
import TodoCard from './components/TodoCard';
import { ITodoDocument } from '../lib/models/todoModel';
import { useSelector } from 'react-redux';
import { ITodoOffline } from '../lib/features/todo/todoSlice';
import { selectIds, selectEntities } from '../lib/features/todo/todoSlice';

const Page = () => {
    const { id } = useAuth()

    const { data, isSuccess, isError, isLoading } = useGetTodosQuery({ userId: id! }, {
        selectFromResult: ({ data, isSuccess, isError, isLoading }) => ({ data, isSuccess, isError, isLoading })
    })
    const offlineTodosIds = useSelector(selectIds)
    const offlineTodosEntities = useSelector(selectEntities)

    let content: ReactNode | null

    if (!id) {
        const renderTodoCard = offlineTodosIds.map(todoId => {
            const todo = offlineTodosEntities[todoId] as ITodoOffline
            return (
                <TodoCard title={todo.title} completed={todo.completed} todoId={todo.id} key={todo.id} />)
        })
        content = renderTodoCard
    } else if (isLoading) {
        content = (<p>Loading...</p>)
    } else if (isSuccess && data) {
        const renderTodoCard = data.ids.map((todoId: string) => {
            if (!id) return

            const todo = data.entities[todoId] as ITodoDocument & { isTemp: boolean }

            return (
                <TodoCard title={todo.title} key={todoId} todoId={todoId} userId={id} completed={todo.completed} isTemp={todo.isTemp} />
            )
        })

        content = renderTodoCard
    } else if (isError) {
        content = (<p>Error occured</p>)
    }

    return (
        <>
            <NewTodoForm />
            <div
                style={{
                    margin: '0 auto', maxWidth: '500px', gap: 5, marginTop: '1rem', display: 'flex', flexDirection: 'column'
                }}
            >
                {content}
            </div>
        </>
    );
};

export default Page;
