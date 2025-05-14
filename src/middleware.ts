import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';

export async function middleware(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        if (error instanceof JWTExpired) {
            return NextResponse.json({ message: 'Token has expired.' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
}

export const config = {
    matcher: ['/api/todos/:path*'],
};