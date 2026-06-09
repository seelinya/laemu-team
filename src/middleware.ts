import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'laemu_team_session'

// Schützt alle /admin-Routen: ohne gültige Session → Redirect zum Login.
// Läuft auf der Edge, daher eigenständige (DB-freie) Token-Prüfung mit jose.
export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const secret = process.env.AUTH_SECRET

  let valid = false
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret))
      valid = true
    } catch {
      valid = false
    }
  }

  if (!valid) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
