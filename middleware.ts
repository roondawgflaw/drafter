import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const requiresAuth = pathname.startsWith('/weeks') || pathname.startsWith('/standings') || pathname.startsWith('/draft') || pathname === '/submit';
  const requiresAdmin = pathname.startsWith('/admin');

  if (requiresAdmin) {
    if (!token || (token as any).role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (requiresAuth) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api/health|public).*)'],
};
