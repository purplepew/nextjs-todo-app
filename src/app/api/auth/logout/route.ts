import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const cookies = req.cookies

    if (!cookies.get('refreshToken')) {
        return NextResponse.json({ message: 'Cookie already cleared.' }, { status: 204 })
    }

    const response = NextResponse.json({ message: 'Logged out successfully.' })
    response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0
    })

    return response
}