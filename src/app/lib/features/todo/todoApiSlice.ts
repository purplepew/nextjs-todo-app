import apiSlice from "../apiSlice";
import { ITodo, ITodoDocument } from "../../models/todoModel";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { setError } from "../error/errorSlice";

const todoAdapter = createEntityAdapter<ITodoDocument, string>({
  selectId: (todo) => (todo.id) as string,
});
const initialState = todoAdapter.getInitialState();

const todoApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTodos: builder.query<EntityState<ITodoDocument, string>, string>({
      query: (userId) => ({
        url: `/api/users/todos/${userId}`,
        method: "GET",
      }),
      transformResponse: (responseData: ITodoDocument[]) => {
        const todos = responseData.map((todo) => ({
          ...todo,
          id: todo._id
        }));
        return todoAdapter.setAll(initialState, todos as ITodoDocument[]);
      },
      providesTags: (result) =>
        result?.ids
          ? [
            { type: "Todos", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Todos" as const, id })),
          ]
          : [{ type: "Todos", id: "LIST" }],
    }),

    addTodo: builder.mutation<{ message: string; todo: ITodoDocument }, ITodo>({
      query: ({ title, userId }) => ({
        url: `/api/todos/new/${userId}`,
        method: "POST",
        body: { title },
      }),
      async onQueryStarted({ title, userId }, { dispatch, queryFulfilled }) {
        const tempId = crypto.randomUUID()
        const timestamp = new Date().toISOString();

        const patchResult = dispatch(
          todoApiSlice.util.updateQueryData("getTodos", userId as string, (draft) => {
            todoAdapter.addOne(draft, {
              title,
              id: tempId,
              userId,
              completed: false,
              updatedAt: timestamp,
              createdAt: timestamp,
            } as unknown as ITodoDocument);
          })
        );

        try {
          const { data } = await queryFulfilled;
          console.log(data)
          dispatch(
            todoApiSlice.util.updateQueryData("getTodos", userId as string, (draft) => {
              todoAdapter.updateOne(draft, {
                id: tempId,
                changes: {
                  id: data.todo._id,
                },
              } as { id: string; changes: Partial<ITodoDocument> });
            })
          );
        } catch {
          patchResult.undo();
          dispatch(setError({ message: "Todo could not be added." }));
        }
      },
    }),

    deleteTodo: builder.mutation<
      { message: string },
      { userId: string; todoId: string }
    >({
      query: ({ userId, todoId }) => ({
        url: `/api/todos/delete/${userId}`,
        method: "POST",
        body: { todoId },
      }),
      invalidatesTags: (_, __, { todoId }) => [
        { type: "Todos", id: todoId },
      ],
      async onQueryStarted({ userId, todoId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApiSlice.util.updateQueryData("getTodos", userId, (draft) => {
            draft.ids = draft.ids.filter((id) => id !== todoId);
            delete draft.entities[todoId];
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          dispatch(setError({ message: "Todo not deleted." }));
        }
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
} = todoApiSlice;

export default todoApiSlice;