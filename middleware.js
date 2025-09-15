// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Public routes
  const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];
  const isPublicPath = publicPaths.includes(pathname);

  // 1️⃣ Logged-in user on public page → redirect based on role
  if (isPublicPath && token) {
    return NextResponse.redirect(
      new URL(token.role === 'admin' ? '/dashboard' : '/', req.url)
    );
  }

  // 2️⃣ Not logged in → block protected pages
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3️⃣ Admin-only routes
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/reports')
  ) {
    if (token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 4️⃣ User-only routes
  if (pathname.startsWith('/products') || pathname.startsWith('/contact')) {
    if (token?.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/dashboard/:path*',
    '/users/:path*',
    '/reports/:path*',
    '/products/:path*',
    '/contact/:path*',
    '/profile', // both roles allowed
  ],
};
