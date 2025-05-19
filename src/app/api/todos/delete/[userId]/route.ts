import { NextRequest, NextResponse } from "next/server";
import { User, Todo } from '../../../../lib/models/models'
import { wait } from "@/app/Providers";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = await params
    const { todoId } = await req.json()

    if (!userId || userId === 'null' || userId === 'undefined') {
        return NextResponse.json({ message: 'userId is required.' }, { status: 400 })
    } else if (!todoId || typeof todoId != 'string') {
        return NextResponse.json({ message: 'todoId is required.' }, { status: 400 })
    }

    try {
        const foundUser = await User.findById(userId).lean().exec()

        if (!foundUser) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 })
        }

        await Todo.deleteOne({ _id: todoId }).exec()

        const result = await User.findByIdAndUpdate(
            foundUser._id,  
            { $pull: { todos: todoId } }
        )

        return NextResponse.json({ message: 'Todo deleted.', result })
    } catch (error) {
        console.log(error)
    }
}