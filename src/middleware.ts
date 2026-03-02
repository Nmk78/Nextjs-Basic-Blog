import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/sign-in', '/sign-up'];
const PROTECTED_ROUTES = ['/dashboard', '/settings'];

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isLoggedIn = !!request.cookies.get('next-auth.session-token');

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === '/') return nextUrl.pathname === '/';
    return nextUrl.pathname.startsWith(route);
  });
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => nextUrl.pathname.startsWith(route));

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }

  if (isLoggedIn && (nextUrl.pathname === '/sign-in' || nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  if (!isPublicRoute && !isLoggedIn && !isApiAuthRoute) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
