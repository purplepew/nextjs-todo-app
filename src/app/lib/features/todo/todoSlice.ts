import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface ITodoOffline {
    title: string,
    completed: boolean,
    id: string,
    createdAt: string,
    updatedAt: string
}

const todosAdapter = createEntityAdapter<ITodoOffline, string>({
    selectId: (todo) => todo.id as string,
    sortComparer: (a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
})

const initialState = todosAdapter.getInitialState()


const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodoOffline: (state, action: { payload: { title: string, completed: boolean, id: string } }) => {
            todosAdapter.addOne(state, { ...action.payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
        },
        removeTodoOffline: (state, action: { payload: { id: string } }) => {
            const { id } = action.payload
            todosAdapter.removeOne(state, id)
        },
        checkTodoOffline: (state, action: { payload: { id: string, completed: boolean } }) => {
            const { id, completed } = action.payload
            todosAdapter.updateOne(state, { id, changes: { completed: !completed, updatedAt: new Date().toISOString() } })
        }
    }
})

export default todoSlice.reducer

export const { addTodoOffline, checkTodoOffline, removeTodoOffline } = todoSlice.actions

export const { selectIds, selectEntities } = todosAdapter.getSelectors((state: RootState) => state.todo ?? initialState)