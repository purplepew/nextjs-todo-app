'use client'
import React, { FormEvent, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import AddIcon from '@mui/icons-material/Add'
import useAuth from '@/app/components/hooks/useAuth'
import { useAddTodoMutation } from '@/app/lib/features/todo/todoApiSlice'

const NewTodoForm = () => {
    const { id } = useAuth()
    const [errMsg, setErrMsg] = useState<string | undefined>("")
    const inputRef = useRef<HTMLInputElement>(null);

    const [addTodo] = useAddTodoMutation()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        const formData = new FormData(e.currentTarget);
        const title = formData.get('title')?.toString().trim()

        if (!title) {
            setErrMsg('A title is required.')
            return
        }

        if (!id) {
            setErrMsg('An id is required.')
            return
        }

        try {

            await addTodo({ title, userId: id }).unwrap()

            if (inputRef.current) {
                inputRef.current.value = ''
                inputRef.current.focus()
            }
        } catch (error) {
            const err = error as unknown as { status?: number, data?: { message: string } }
            const message = err.status == 401 ? 'Please log in.' : err?.data?.message
            setErrMsg(message)
            console.log(err)
        }

    }

    return (
        <form onSubmit={handleSubmit} style={{ margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr .1fr', width: '500px', gap: 2 }}>
            <TextField label='Add a todo' name='title' inputRef={inputRef} />
            <Button startIcon={<AddIcon />} variant='contained' size='small' color='success' type='submit'>Add</Button>
            <Snackbar autoHideDuration={5000} message={errMsg} open={Boolean(errMsg)} onClose={() => setErrMsg('')} />
        </form>
    )
}

export default NewTodoForm