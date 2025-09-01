import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Todo } from "@/app/lib/models/models";
import { connectToMongoDB } from "@/app/lib/db";

export async function POST(req: NextRequest) {
    const { todoId } = await req.json()

    if (!todoId || typeof todoId != 'string') {
        return NextResponse.json({ message: 'todoId is required.' }, { status: 400 })
    }

    try {
        await connectToMongoDB()

        const todo = await Todo.findById(todoId).exec()

        if (!todo) {
            return NextResponse.json({ message: 'Todo not found.' }, { status: 404 })
        }

        todo.completed = !todo.completed

        await todo.save()

        return NextResponse.json({ message: todo.completed ? 'Todo checked.' : 'Todo unchecked' })
    } catch (error) {
        console.log('failed to check todo ', error)
        return NextResponse.json({ message: 'failed to check/uncheck todo ' }, { status: 500 })

    }

}