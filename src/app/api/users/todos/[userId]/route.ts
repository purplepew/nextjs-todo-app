import { NextRequest, NextResponse } from 'next/server'
import { User } from '../../../../lib/models/models'
import { connectToMongoDB } from '@/app/lib/db'

export async function GET(req: NextRequest) {
    const url = req.nextUrl
    const userId = url.pathname.split('/').pop()


    if (!userId || userId === 'null' || userId === 'undefined') {
        return NextResponse.json({ message: 'userId is required.' }, { status: 400 })
    }

    await connectToMongoDB()

    try {
        const foundUser = await User.findById(userId).exec()
        console.log('fetching the user..')

        if (!foundUser) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 })
        }

        const foundUserWithTodos = await foundUser.populate('todos')
        return NextResponse.json(foundUserWithTodos?.todos)
    } catch (error) {
        console.log('failed to fetch todos ', error)
        return NextResponse.json({ message: 'failed to fetch todos ' + error }, { status: 400 })
    }
}