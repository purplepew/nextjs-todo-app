import client from "@/app/lib/OAuthClient";
import { NextResponse } from "next/server";

export const GET = async () => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['openid', 'email', 'profile']
    })

    return NextResponse.json(url)
}