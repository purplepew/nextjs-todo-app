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

const normalizedId = (todo: ITodoDocument) => ({ ...todo, id: todo._id })

const todoApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTodos: builder.query<EntityState<ITodoDocument, string>, { userId: string }>({
      query: ({ userId }) => `/api/users/todos/${userId}`,
      transformResponse: async (responseData: ITodoDocument[]) => {
        const todos = await Promise.all(responseData.map(normalizedId))
        return todosAdapter.upsertMany(initialState, todos as ITodoDocument[]);
      },
      keepUnusedDataFor: 60, // seconds
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
              isTemp: true
            } as unknown as ITodoDocument);
          })
        );
        try {
          const { data } = await queryFulfilled;

          dispatch(
            todoApiSlice.util.updateQueryData("getTodos", { userId } as { userId: string }, (draft) => {
              todosAdapter.updateOne(draft, {
                id: tempId,
                changes: {
                  id: data.todo._id,
                  isTemp: false
                },
              } as { id: string; changes: Partial<ITodoDocument> })
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
      onQueryStarted: async ({ todoId, userId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(todoApiSlice.util.updateQueryData('getTodos', { userId } as { userId: string }, (draft) => {
            todosAdapter.updateOne(draft, {
              id: todoId,
              changes: {
                completed: !draft.entities[todoId].completed,
                updatedAt: new Date().toISOString()
              }
            } as { id: string; changes: Partial<ITodoDocument> })
          }))

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