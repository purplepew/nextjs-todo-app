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
    // Remove sortComparer to disable automatic sorting
    // This allows drag-and-drop order to persist
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
        },
        initializeTodo: (state, action: { payload: { todos: ITodoOffline[] } }) => {
            const { todos } = action.payload
            todosAdapter.setAll(state, todos)
        },
        reorderTodos: (state, action: { payload: { orderedIds: string[] } }) => {
            const { orderedIds } = action.payload
            const entities = state.entities
            const reorderedTodos: ITodoOffline[] = []
            
            console.log('[todoSlice] Reordering todos with orderedIds:', orderedIds)
            
            orderedIds.forEach(id => {
                if (entities[id]) {
                    reorderedTodos.push(entities[id]!)
                }
            })
            
            console.log('[todoSlice] Reordered todos:', reorderedTodos.map(t => t.id))
            todosAdapter.setAll(state, reorderedTodos)
        }
    }
})

export default todoSlice.reducer

export const { addTodoOffline, checkTodoOffline, removeTodoOffline, initializeTodo, reorderTodos } = todoSlice.actions

export const { selectAll: selectAllOfflineTodos } = todosAdapter.getSelectors((state: RootState) => state.todo ?? initialState)