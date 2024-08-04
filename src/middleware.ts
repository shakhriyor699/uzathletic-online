import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";



export default async function middleware(req: NextRequest, res: NextResponse) {
  const { url, cookies } = req
  const token = cookies.get('token')?.value

  if (url.includes('/admin') && !token || url.includes('/user') && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token) {
    const url = req.nextUrl.clone()
    if (url.pathname.includes('/admin')) {
      const decoded = jwtDecode(token) as any
      if (decoded['user-data'].role.name === 'judge') {
        return NextResponse.redirect(new URL('/user', req.url))
      }
    }
  }

  if (token) {
    const url = req.nextUrl.clone()
    if (url.pathname.includes('/user')) {
      const decoded = jwtDecode(token) as any
      if (decoded['user-data'].role.name === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }
  }

  if (token) {
    const url = req.nextUrl.clone()
    if (url.pathname.includes('/login')) {
      const decoded = jwtDecode(token) as any
      if (decoded['user-data'].role.name === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }
  }
  if (token) {
    const url = req.nextUrl.clone()
    if (url.pathname.includes('/login')) {
      const decoded = jwtDecode(token) as any
      if (decoded['user-data'].role.name === 'judge') {
        return NextResponse.redirect(new URL('/user', req.url))
      }
    }
  }

  if (url.includes('/admin') && token) {
    const decoded = jwtDecode(token) as any
    if (decoded['user-data'].role.name !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    '/',
    '/user/:path*'
  ]
}