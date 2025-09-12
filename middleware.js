// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/register';

  // if logged in, prevent accessing login/register again
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // if not logged in, block protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/login', '/register'], // add more protected routes here
};
