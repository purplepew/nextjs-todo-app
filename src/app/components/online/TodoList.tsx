'use client'
import useAuth from "@/app/hooks/useAuth"
import { useGetTodosQuery } from "@/app/lib/features/todo/todoApiSlice"
import TodoCard from '../TodoCard'
import Typography from '@mui/material/Typography'
import { ITodoDocument } from "@/app/lib/models/todoModel"
import { TodoSkeleton } from "../TodoCard"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Snackbar } from "@mui/material"

export default function TodoList() {
    const { id: userId } = useAuth()
    const [errMsg, setErrMsg] = useState('')
    const [orderedIds, setOrderedIds] = useState<string[]>([])
    const draggedIdRef = useRef<string | null>(null)
    const dragOverIdRef = useRef<string | null>(null)

    const throwError = useCallback((message: string) => {
        setErrMsg(message)
    }, [setErrMsg])

    const { data, isLoading, isSuccess } = useGetTodosQuery({ userId: userId! }, {
        skip: !Boolean(userId),
        selectFromResult: ({ data, isLoading, isSuccess }) => ({ data, isLoading, isSuccess })
    })

    // Merge auto-sorted ids with the current drag order:
    // new items are placed at the top (honoring the existing sort), deleted items are removed
    useEffect(() => {
        if (!data?.ids) return
        const newIds = data.ids as string[]
        setOrderedIds(prev => {
            const existingSet = new Set(prev)
            const newSet = new Set(newIds)
            const filtered = prev.filter(id => newSet.has(id))
            const added = newIds.filter(id => !existingSet.has(id))
            return [...added, ...filtered]
        })
    }, [data?.ids])

    const handleDragStart = useCallback((id: string) => {
        draggedIdRef.current = id
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent, overId: string) => {
        e.preventDefault()
        if (!draggedIdRef.current || draggedIdRef.current === overId) return
        // Skip if still over the same element to avoid excessive state updates
        if (dragOverIdRef.current === overId) return
        dragOverIdRef.current = overId
        setOrderedIds(prev => {
            const fromIndex = prev.indexOf(draggedIdRef.current!)
            const toIndex = prev.indexOf(overId)
            if (fromIndex === -1 || toIndex === -1) return prev
            const next = [...prev]
            next.splice(fromIndex, 1)
            next.splice(toIndex, 0, draggedIdRef.current!)
            return next
        })
    }, [])

    const handleDragEnd = useCallback(() => {
        draggedIdRef.current = null
        dragOverIdRef.current = null
    }, [])

    // FOR THE TODO WITH ACCOUNT
    if (isLoading) {
        return (
            <>
                <TodoSkeleton />
                <TodoSkeleton />
                <TodoSkeleton />
            </>
        )
    } else if (isSuccess && orderedIds.length) {
        return (
            <>
                {orderedIds.map(todoId => {
                    const todo = data?.entities[todoId] as ITodoDocument & { isTemp: boolean }
                    if (!todo) return null
                    const isDragging = draggedIdRef.current === todoId
                    return (
                        <div
                            key={todoId}
                            draggable
                            onDragStart={() => handleDragStart(todoId)}
                            onDragOver={(e) => handleDragOver(e, todoId)}
                            onDragEnd={handleDragEnd}
                            style={{
                                opacity: 1,
                                cursor: 'pointer',
                                outline: isDragging ? '2px dashed #90caf9' : 'none',
                                borderRadius: 4,
                            }}
                        >
                            <TodoCard
                                title={todo.title}
                                todoId={todo.id}
                                completed={todo.completed}
                                userId={userId ?? undefined}
                                isTemp={todo.isTemp}
                                throwError={throwError}
                            />
                        </div>
                    )
                })}
                <Snackbar
                    aria-label='error popup'
                    autoHideDuration={5000}
                    message={errMsg}
                    open={Boolean(errMsg)}
                    onClose={() => setErrMsg('')}
                />
            </>
        )
    } else {
        return <Typography>Empty.</Typography>
    }
}