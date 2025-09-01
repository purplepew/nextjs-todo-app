'use client'
import { initializeTodo, selectAllOfflineTodos } from '@/app/lib/features/todo/todoSlice'
import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TodoCard from '../TodoCard'
import { Typography } from '@mui/material'
import { TodoSkeleton } from '../TodoCard'
import { RootState } from '@/app/lib/store'

export default function TodoList() {
    const dispatch = useDispatch()

    const isLoadingAuth = useSelector((state: RootState) => state.auth.isLoading)

    const hasLoadedOfflineTodo = useRef(false)

    const offlineTodos = useSelector(selectAllOfflineTodos)

    // Initialize the offlineTodos state with the datas in the localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const todos = JSON.parse(localStorage.getItem('todos') ?? '[]')
            if (Array.isArray(todos) && todos.length > 0) {
                dispatch(initializeTodo({ todos }))
            }
            hasLoadedOfflineTodo.current = true
        }
    }, [dispatch])

    // Saves todos in the localStorage. On initial load and when offlineTodos state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('todos', JSON.stringify(offlineTodos))
        }
    }, [offlineTodos])

    const renderOfflineTodos = useMemo(() => {
        return offlineTodos?.map(todo => (
            <TodoCard title={todo.title} todoId={todo.id} completed={todo.completed} key={todo.id} />
        ))
    }, [offlineTodos])

    if (hasLoadedOfflineTodo.current == false || isLoadingAuth) {
        return (
            <>
                <TodoSkeleton />
                <TodoSkeleton />
                <TodoSkeleton />
            </>
        )
    } else if (renderOfflineTodos?.length) {
        return renderOfflineTodos
    } else {
        return <Typography>Empty.</Typography>
    }
}