'use client'
import { initializeTodo, selectAllOfflineTodos, reorderTodos } from '@/app/lib/features/todo/todoSlice'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TodoCard from '../TodoCard'
import { Typography } from '@mui/material'

export default function TodoList() {
    const dispatch = useDispatch()

    const offlineTodos = useSelector(selectAllOfflineTodos)
    const [orderedIds, setOrderedIds] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('todoOrder')
            console.log('[TodoList] Initial mount - saved todoOrder:', saved)
            const parsed = saved ? JSON.parse(saved) : []
            console.log('[TodoList] Initial mount - parsed orderedIds:', parsed)
            return parsed
        }
        return []
    })
    const [dragOverId, setDragOverId] = useState<string | null>(null)
    const draggedIdRef = useRef<string | null>(null)
    const dragOverIdRef = useRef<string | null>(null)

    // Initialize the offlineTodos state with the datas in the localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const todos = JSON.parse(localStorage.getItem('todos') ?? '[]')
            console.log('[TodoList] Loading todos from localStorage:', todos)
            if (Array.isArray(todos) && todos.length > 0) {
                dispatch(initializeTodo({ todos }))
            }
        }
    }, [dispatch])

    // Saves todos in the localStorage. On initial load and when offlineTodos state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('todos', JSON.stringify(offlineTodos))
        }
    }, [offlineTodos])

    // Saves the todo order in localStorage whenever orderedIds changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('[TodoList] orderedIds changed, saving to localStorage:', orderedIds)
            localStorage.setItem('todoOrder', JSON.stringify(orderedIds))
            console.log('[TodoList] Saved orderedIds to localStorage')
        }
    }, [orderedIds])

    // Reorder the Redux todos to match the orderedIds (only after user drags)

    // Merge auto-sorted ids with the current drag order:
    // new items are placed at the top (honoring the existing sort), deleted items are removed
    useEffect(() => {
        const newIds = offlineTodos.map(t => t.id)
        console.log('[TodoList] offlineTodos changed, newIds:', newIds)
        setOrderedIds(prev => {
            const existingSet = new Set(prev)
            const newSet = new Set(newIds)
            const filtered = prev.filter(id => newSet.has(id))
            const added = newIds.filter(id => !existingSet.has(id))
            const result = [...added, ...filtered]
            console.log('[TodoList] Merged order - prev:', prev, 'result:', result)
            return result
        })
    }, [offlineTodos])

    const handleDragStart = useCallback((id: string) => {
        draggedIdRef.current = id
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent, overId: string) => {
        e.preventDefault()
        if (!draggedIdRef.current || draggedIdRef.current === overId) return
        // Skip if still over the same element to avoid excessive state updates
        if (dragOverIdRef.current === overId) return
        dragOverIdRef.current = overId
        setDragOverId(overId)
        console.log('[TodoList] Dragging', draggedIdRef.current, 'over', overId)
        setOrderedIds(prev => {
            const fromIndex = prev.indexOf(draggedIdRef.current!)
            const toIndex = prev.indexOf(overId)
            if (fromIndex === -1 || toIndex === -1) return prev
            const next = [...prev]
            next.splice(fromIndex, 1)
            next.splice(toIndex, 0, draggedIdRef.current!)
            console.log('[TodoList] New order after drag:', next)
            return next
        })
    }, [])

    const handleDragEnd = useCallback(() => {
        console.log('[TodoList] Drag ended, current orderedIds:', orderedIds)
        draggedIdRef.current = null
        dragOverIdRef.current = null
        setDragOverId(null)
        // Save order to localStorage after drag completes
        if (typeof window !== 'undefined') {
            console.log('[TodoList] Saving order after drag end:', orderedIds)
            localStorage.setItem('todoOrder', JSON.stringify(orderedIds))
            console.log('[TodoList] Order saved to localStorage')
            // Reorder Redux todos to match the user's drag order
            if (orderedIds.length > 0) {
                console.log('[TodoList] Reordering todos to match drag order:', orderedIds)
                dispatch(reorderTodos({ orderedIds }))
            }
        }
    }, [orderedIds, dispatch])

    const todoMap = Object.fromEntries(offlineTodos.map(t => [t.id, t]))

    if (!offlineTodos.length) {
        return <Typography>Empty.</Typography>
    }

    return (
        <>
            {orderedIds.map(id => {
                const todo = todoMap[id]
                if (!todo) return null
                const isDragging = draggedIdRef.current === id
                return (
                    <div
                        key={id}
                        draggable
                        onDragStart={() => handleDragStart(id)}
                        onDragOver={(e) => handleDragOver(e, id)}
                        onDragEnd={handleDragEnd}
                        style={{
                            opacity: 1,
                            cursor: 'pointer',
                            outline: isDragging ? '2px dashed #90caf9' : 'none',
                            borderRadius: 4,
                        }}
                    >
                        <TodoCard title={todo.title} todoId={todo.id} completed={todo.completed} />
                    </div>
                )
            })}
        </>
    )
}