import client from "@/app/lib/OAuthClient";
import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import User, { IUserDocument } from "@/app/lib/models/userModel"
import { connectToMongoDB } from "@/app/lib/db"
import { TokenPayload } from "google-auth-library";

if (!process.env.JWT_REFRESH_TOKEN_SECRET ) {
    throw new Error('JWT_REFRESH_TOKEN_SECRET is not defined in the environment variables.');
}
if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not defined in the environment variables.');
}
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined in the environment variables.');
}

export const GET = async (req: NextRequest) => {
    const code = req.nextUrl.searchParams.get('code')

    if (!code) {
        return NextResponse.json({ message: 'Missing code' }, { status: 400 })
    }

    let payload: TokenPayload | undefined
    let user: IUserDocument | null

    try {
        const { tokens } = await client.getToken(code)
        client.setCredentials(tokens)

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        payload = ticket.getPayload()

        if (!payload) {
            return NextResponse.json({ message: 'Ticket\'s payload is missing. ' }, { status: 500 })
        }

    } catch {
        // console.error('Error during Google OAuth callback:', error);
        return NextResponse.json({ error: 'An error occurred during authentication.' }, { status: 500 });
    }

    try {
        await connectToMongoDB()

        user = await User.findOne({ email: payload?.email }).exec()

        if (!user) {
            user = await User.create({
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                todos: []
            })
            console.log("New user created.")
        }

    } catch {
       // console.log('Error during mongodb query:', error);
        return NextResponse.json({ error: 'An error occurred during mongodb query.' }, { status: 500 });
    }

    const refreshToken = jwt.sign(
        {
            "UserInfo": {
                id: user._id?.toString()
            }
        },
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        { expiresIn: '10m' }
    )

    const response = NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL!)

    response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600
    })

    return response

}