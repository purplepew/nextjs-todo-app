import apiSlice from "../apiSlice";
import { ITodo, ITodoDocument } from "../../models/todoModel";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { EntityState } from "@reduxjs/toolkit";

const todoAdapter = createEntityAdapter<{ id: string }>()
const initialState = todoAdapter.getInitialState()

const todoApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getTodos: builder.query<EntityState<{ id: string }, string>, string>({
            query: (userId) => ({
                url: `/api/users/todos/${userId}`,
                method: 'GET',
            }),
            transformResponse: (responseData: ITodoDocument[]) => {
                const modifiedData = responseData.map((todo: ITodoDocument) => ({
                    id: todo._id, // Explicitly cast _id to string
                    ...todo
                }))
                return todoAdapter.setAll(initialState, modifiedData);
            },
            providesTags: ['Todos']
        }),
        addTodo: builder.mutation<{ message: string, todo: ITodo }, ITodo>({
            query: ({ title, userId }) => ({
                url: `/api/todos/new/${userId}`,
                method: 'POST',
                body: { title }
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation<{ message: string, result: any }, { userId: string, todoId: string }>({
            query: ({ userId, todoId }) => ({
                url: `/api/todos/delete/${userId}`,
                method: 'POST',
                body: { todoId }
            }),
            invalidatesTags: ['Todos']
        })
    })
})

export const { useGetTodosQuery, useAddTodoMutation, useDeleteTodoMutation } = todoApiSlice

export default todoApiSlice