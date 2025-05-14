import { NextResponse, NextRequest } from "next/server";
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import User, { IUserInfo } from "@/app/lib/models/userModel";

if (!process.env.JWT_REFRESH_TOKEN_SECRET || !process.env.JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('JWT_ACCESS_TOKEN_SECRET OR JWT_REFRESH_TOKEN_SECRET is not defined in the environment variables.');
}

export const GET = async (req: NextRequest) => {
    const cookies = req.cookies

    if (!cookies.get('refreshToken')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const refreshToken = cookies.get('refreshToken')?.value

    try {
        const decoded = jwt.verify(refreshToken!, process.env.JWT_REFRESH_TOKEN_SECRET!) as { UserInfo: {id: string} }

        const foundUser = await User.findById(decoded.UserInfo.id).lean().exec()

        if (!foundUser) {
            return NextResponse.json({ message: 'Internal server error. Could not find user' }, { status: 500 })
        }

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    name: foundUser.name,
                    email: foundUser.email,
                    picture: foundUser.picture,
                    id: foundUser._id
                }
            },
            process.env.JWT_ACCESS_TOKEN_SECRET!,
            { expiresIn: '1m' }
        )

        return NextResponse.json({ accessToken })

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return NextResponse.json({ message: 'Token has expired' }, { status: 401 })
        }
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
}