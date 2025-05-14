'use client'
import useAuth from '../components/hooks/useAuth'
import NewTodoForm from './components/NewTodoForm'
import { useGetTodosQuery } from '../lib/features/todo/todoApiSlice'
import { ReactNode } from 'react';
import TodoCard from './components/TodoCard';
import { ITodoDocument } from '../lib/models/todoModel';

const Page = () => {
    const { id } = useAuth()

    const { data, isSuccess, isError, isLoading } = useGetTodosQuery(id!, { skip: !id })

    let content: ReactNode | null

    if (isLoading) {
        content = (<p>Loading...</p>)
    } else if (isSuccess) {
        const renderTodoCard = data.ids.map(todoId => {

            if(!id) return 

            const todo = data.entities[todoId] as ITodoDocument

            return (
                <TodoCard title={todo.title} key={todoId} todoId={todoId} userId={id} />
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
                    margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', width: '500px', gap: 5, marginTop: '1rem'
                }}
            >
                {content}
            </div>
        </>
    );
};

export default Page;
