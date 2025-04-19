// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    console.log(`Middleware running for: ${path}`);

    // 1. Lấy token - sửa lại cách lấy cookie
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production'
    });

    console.log('Token exists:', !!token);

    // 2. Public routes không cần kiểm tra
    const publicPaths = ['/login', '/api/auth', '/_next'];
    if (publicPaths.some(p => path.startsWith(p))) {
        return NextResponse.next();
    }

    // 3. Xử lý khi không có token
    if (!token) {
        console.log('Redirecting to login');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Kiểm tra role cho admin routes
    if (path.startsWith('/admin') && token.role !== 'admin') {
        console.log('User is not admin');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*'
    ]
};