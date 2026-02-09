import { NextRequest, NextResponse } from 'next/server'
import { User } from '../../../../lib/models/models'
import { connectToMongoDB } from '@/app/lib/db'

export async function GET(req: NextRequest) {
    const url = req.nextUrl
    const userId = url.pathname.split('/').pop()


    if (!userId || userId === 'null' || userId === 'undefined') {
        return NextResponse.json({ message: 'userId is required.' }, { status: 400 })
    }

    try {
        await connectToMongoDB()

        const foundUser = await User.findById(userId).exec()
        console.log('fetching the user..')

        if (!foundUser) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 })
        }

        const foundUserWithTodos = await foundUser.populate('todos')
        return NextResponse.json(foundUserWithTodos?.todos)
    } catch (error) {
        console.log('failed to fetch todos ', error)
        
        // Check if it's a MongoDB inactive error
        if (error instanceof Error && error.message === 'MongoDB Database is Inactive') {
            return NextResponse.json({ message: 'MongoDB Database is Inactive' }, { status: 503 })
        }
        
        return NextResponse.json({ message: 'failed to fetch todos '}, { status: 400 })
    }
}