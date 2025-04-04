import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Cookies from 'js-cookie';
// This function can be marked `async` if using `await` inside 
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;
    const isPublicPath = path === "/signin" || path === "/signup" || path === "/";

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/signin",
        "/signup",
        "/room",
        "/room/:path*",
    ]
}