import apiSlice from "../apiSlice";
import { ITodo, ITodoDocument } from "../../models/todoModel";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { setError } from "../error/errorSlice";

const todosAdapter = createEntityAdapter<ITodoDocument, string>({
  selectId: (todo) => (todo.id) as string,
  sortComparer: (a, b) => {
  // Prioritize incomplete todos
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }

  // If both are the same completion status, sort by updatedAt (newest first)
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}
});
const initialState = todosAdapter.getInitialState();

const todoApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTodos: builder.query<EntityState<ITodoDocument, string>, { userId: string }>({
      query: ({ userId }) => ({
        url: `/api/users/todos/${userId}`,
        method: "GET",
      }),
      transformResponse: (responseData: ITodoDocument[]) => {
        const todos = responseData.map((todo) => ({
          ...todo,
          id: todo._id
        }));
        return todosAdapter.setAll(initialState, todos as ITodoDocument[]);
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
          todoApiSlice.util.updateQueryData("getTodos", { userId } as { userId: string }, (draft) => {
            todosAdapter.addOne(draft, {
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
            todoApiSlice.util.updateQueryData("getTodos", { userId } as { userId: string }, (draft) => {
              todosAdapter.updateOne(draft, {
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
          todoApiSlice.util.updateQueryData("getTodos", { userId } as { userId: string }, (draft) => {
            draft.ids = draft.ids.filter((id) => id !== todoId);
            delete draft.entities[todoId];
          })
        );

        try {
          await queryFulfilled;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          patchResult.undo();
          dispatch(setError({ message: "Todo could not be deleted: " + error?.error?.data?.message }));
        }
      },
    }),
    checkTodo: builder.mutation<{ message: string }, { todoId: string, userId: string }>({
      query: ({ todoId }) => ({
        url: `/api/todos/check`,
        method: 'POST',
        body: { todoId }
      }),
      invalidatesTags: (_, __, { todoId }) => [
        { type: "Todos", id: todoId },
      ],
      onQueryStarted: async ({ todoId, userId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          todoApiSlice.util.updateQueryData('getTodos', { userId } as { userId: string }, (draft) => {
             draft.entities[todoId].completed = !draft.entities[todoId].completed 
          }
          
          ))

        try {
          await queryFulfilled
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          patchResult.undo();
          dispatch(setError({ message: "Todo could not be checked: " + error?.error?.data?.message }));
        }

      }
    })
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useCheckTodoMutation
} = todoApiSlice;

export default todoApiSlice;