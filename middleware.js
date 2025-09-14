// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Public routes
  const isPublicPath =
    path === '/login' ||
    path === '/register' ||
    path === '/forgot-password' ||
    path === '/reset-password';

  // 1️⃣ Logged in user tries to access public page → redirect based on role
  if (isPublicPath && token) {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 2️⃣ Not logged in user tries to access protected page → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3️⃣ Role-based protection for admin-only routes
  const adminOnlyPaths = ['/dashboard', '/users', '/reports'];
  if (adminOnlyPaths.includes(path) && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 4️⃣ User-only pages (exclude /profile so both roles can access)
  const userOnlyPaths = ['/products', '/contact'];
  if (userOnlyPaths.includes(path) && token?.role === 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/dashboard',
    '/users',
    '/reports',
    '/products',
    '/contact',
    '/profile', // accessible by both roles
  ],
};
