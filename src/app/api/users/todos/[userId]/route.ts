import { NextRequest, NextResponse } from 'next/server'
import { User } from '../../../../lib/models/models'

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = await params

    if (!userId || userId === 'null' || userId === 'undefined') {
        return NextResponse.json({ message: 'userId is required.' }, { status: 400 })
    }

    try {
        const foundUserWithTodosPopulated = await User.findById(userId).populate('todos').exec()
        return NextResponse.json(foundUserWithTodosPopulated?.todos)
    } catch (error) {
        console.log('failed to fetch todos ', error)
        return NextResponse.json({ message: 'failed to fetch todos ' + error }, { status: 400 })
    }
}