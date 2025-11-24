import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();

        if (password === process.env.ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true });
            // Set a cookie for the session
            response.cookies.set('admin_session', password, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
            return response;
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
