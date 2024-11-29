import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value;

  // Admin sayfalarını koruma
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sessionId) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Session kontrolü
    try {
      const response = await fetch(new URL('/api/auth/verify', request.url), {
        headers: {
          'Cookie': `sessionId=${sessionId}`
        }
      });

      if (!response.ok) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Session verification error:', error);
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Login sayfası kontrolü
  if (request.nextUrl.pathname === '/login' && sessionId) {
    try {
      const response = await fetch(new URL('/api/auth/verify', request.url), {
        headers: {
          'Cookie': `sessionId=${sessionId}`
        }
      });

      if (response.ok) {
        const adminUrl = new URL('/admin', request.url);
        return NextResponse.redirect(adminUrl);
      }
    } catch (error) {
      console.error('Session verification error:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};