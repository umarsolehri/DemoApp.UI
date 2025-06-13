import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/';

  if (!token && !isAuthPage) {
    // Redirect to login if accessing protected route without token
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if accessing login page with token
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}; 