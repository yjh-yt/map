import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const proto = req.headers.get('x-forwarded-proto') || 'https'
  const isLocal = /^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)

  if (!isLocal && proto === 'http') {
    return new NextResponse('访问被拒绝：本系统仅支持 HTTPS 协议', { status: 403 })
  }

  if (!req.cookies.get('auth') && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}

export default middleware

export const config = { matcher: ['/((?!api|_next).*)'] }
