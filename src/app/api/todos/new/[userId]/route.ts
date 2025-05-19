import { NextRequest, NextResponse } from "next/server";
import { User, Todo } from '../../../../lib/models/models'
import { ObjectId } from "mongoose";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = await params
    const { title } = await req.json()

    if (!userId || userId === 'null' || userId === 'undefined') {
        return NextResponse.json({ message: 'userId is required.' }, { status: 400 })
    } else if (!title || typeof title != 'string') {
        return NextResponse.json({ message: 'title is required.' }, { status: 400 })
    }

    try {
        const foundUser = await User.findById(userId).exec()
        
        if (!foundUser) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 })
        }

        const newTodo = await Todo.create({ title, completed: false, userId})
        foundUser.todos.push(newTodo._id as ObjectId)
        await foundUser.save()

        return NextResponse.json({ message: 'New todo created.', todo: newTodo})
    } catch (error) {
        console.log('failed to create a new todo ', error)
        return NextResponse.json({ message: 'failed to create a new todo ' + error }, { status: 500 })
    }
}