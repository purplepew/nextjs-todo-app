import { NextRequest, NextResponse } from "next/server";
import { User } from '../../../../lib/models/models'
import { connectToMongoDB } from "@/app/lib/db";

export async function POST(req: NextRequest) {
    const url = req.nextUrl
    const userId = url.pathname.split('/').pop()
    const { orderedIds } = await req.json()

    if (!userId || userId === 'null' || userId === 'undefined') {
        return NextResponse.json({ message: 'userId is required.' }, { status: 400 })
    } else if (!Array.isArray(orderedIds)) {
        return NextResponse.json({ message: 'orderedIds is required.' }, { status: 400 })
    }

    try {
        await connectToMongoDB()

        const foundUser = await User.findById(userId).exec()

        if (!foundUser) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 })
        }

        const existingIds = new Set(foundUser.todos.map((id) => id.toString()))
        const isValid = orderedIds.every((id: string) => existingIds.has(id)) &&
            orderedIds.length === existingIds.size

        if (!isValid) {
            return NextResponse.json({ message: 'orderedIds must match existing todos exactly.' }, { status: 400 })
        }

        foundUser.todos = orderedIds
        await foundUser.save()

        return NextResponse.json({ message: 'Todos reordered.' })
    } catch (error) {
        console.error('failed to reorder todos ', error)
        return NextResponse.json({ message: 'Failed to reorder todos. The database may be temporarily unavailable, please try again.' }, { status: 500 })
    }
}
