import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const SESSION_COOKIE = 'laemu_team_session'
const SESSION_DAYS = 7

export type SessionPayload = {
  sub: string // TeamUser id
  email: string
  name: string
  role: string
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'AUTH_SECRET fehlt oder ist zu kurz. Bitte in .env setzen (mind. 32 Zeichen).',
    )
  }
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// Loggt einen Team-Nutzer ein: prüft Zugangsdaten und setzt das Session-Cookie.
export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const user = await db.teamUser.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!user || !user.active) return { ok: false, error: 'Unbekannte E-Mail oder Konto deaktiviert.' }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return { ok: false, error: 'Falsches Passwort.' }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })

  return { ok: true }
}

export async function logout() {
  cookies().delete(SESSION_COOKIE)
}

// Liest die aktuelle Session (oder null). Für Server Components / Actions.
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

// Erzwingt eine gültige Session, sonst Redirect zum Login.
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}

// Erzwingt eine Admin-Session (für sensible Aktionen wie Team-Verwaltung).
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession()
  if (session.role !== 'admin') {
    throw new Error('Diese Aktion ist nur für Admins erlaubt.')
  }
  return session
}
