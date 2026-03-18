import { type NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'quibes-session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get(SESSION_COOKIE)
  const isAuthenticated = Boolean(session?.value)

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginRoute = pathname === '/login'

  // Unauthenticated → redirect to /login, preserve original destination
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already authenticated → skip login page, go straight to dashboard
  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
}
