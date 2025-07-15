'use client'
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import AddIcon from '@mui/icons-material/Add'
import useAuth from '@/app/hooks/useAuth'
import { useAddTodoMutation } from '@/app/lib/features/todo/todoApiSlice'
import { useDispatch } from 'react-redux'
import { addTodoOffline } from '@/app/lib/features/todo/todoSlice'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const NewTodoForm = () => {
    const dispatch = useDispatch()

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const previousUrlRef = useRef<null | string>(null)

    const { id } = useAuth()

    const titleParams = searchParams.get("title")
    const [title, setTitle] = useState(titleParams ?? "")

    const inputRef = useRef<HTMLInputElement>(null)
    const [errMsg, setErrMsg] = useState<string | undefined>("")

    const [addTodo] = useAddTodoMutation()

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)

        return params.toString()
    }, [searchParams])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title) return setErrMsg('A title is required.')

        if (!id) {
            dispatch(addTodoOffline({ title, completed: false, id: crypto.randomUUID() }))
            setTitle('')
            router.push(pathname)
            inputRef?.current?.focus()
        } else {
            const cacheTitle = title
            try {
                previousUrlRef.current = searchParams.get("title")
                
                setTitle('')
                
                await addTodo({ title: cacheTitle, userId: id }).unwrap()

                router.push(pathname)

                inputRef?.current?.focus()

            } catch (error) {
                const err = error as unknown as { status?: number, data?: { message: string }, message: string }
                const message = err.status == 401 ? 'Please log in.' : err?.data?.message ?? err.message
                setErrMsg(message)
                setTitle(previousUrlRef.current ?? "")
            }
        }
    }

    //Debounce title 
    useEffect(() => {
        if (title == "") return

        const setter = setTimeout(() => {
            router.push(pathname + "?" + createQueryString('title', title))
        }, 20)

        return () => clearTimeout(setter)
    }, [title])

    return (
        <form onSubmit={handleSubmit}
            style={{
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr .1fr',
                minWidth: '20.5rem',
                maxWidth: '500px',
                gap: 2,
            }}>

            <TextField
                label='Add a todo'
                name='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputRef={inputRef}
                aria-label='Input todo'
            />

            <Button type='submit' aria-label='Add todo'>
                <AddIcon />
            </Button>

            <Snackbar aria-label='error popup' autoHideDuration={5000} message={errMsg} open={Boolean(errMsg)} onClose={() => setErrMsg('')} />

        </form>
    )
}

export default NewTodoForm