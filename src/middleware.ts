import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { authSecretBytes, authDisabled } from '@/lib/secret'

const SESSION_COOKIE = 'laemu_team_session'

// Schützt alle /admin-Routen: ohne gültige Session → Redirect zum Login.
// Läuft auf der Edge, daher eigenständige (DB-freie) Token-Prüfung mit jose.
export async function middleware(req: NextRequest) {
  // Login deaktiviert → kein Schutz, direkter Zugriff auf /admin.
  if (authDisabled()) return NextResponse.next()

  const token = req.cookies.get(SESSION_COOKIE)?.value

  let valid = false
  if (token) {
    try {
      await jwtVerify(token, authSecretBytes())
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
