import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { authSecretBytes } from './secret'

export const SESSION_COOKIE = 'laemu_team_session'
const SESSION_DAYS = 7

export type SessionPayload = {
  sub: string // TeamUser id
  email: string
  name: string
  role: string
}

function secretKey(): Uint8Array {
  return authSecretBytes()
}

// Standard-Admin (wird automatisch angelegt, falls die DB noch leer ist).
export const DEFAULT_ADMIN = {
  email: (process.env.SEED_ADMIN_EMAIL || 'team@laemu.ch').toLowerCase(),
  password: process.env.SEED_ADMIN_PASSWORD || 'laemu-team-2026',
  name: process.env.SEED_ADMIN_NAME || 'LAEMU Team',
}

// Sicherheitsnetz: Gibt es noch kein Team-Konto, wird das Standard-Admin-Konto
// angelegt. So funktioniert der dokumentierte Login auch ohne separaten Seed.
export async function ensureDefaultAdmin(): Promise<void> {
  const count = await db.teamUser.count()
  if (count > 0) return
  await db.teamUser.create({
    data: {
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      role: 'admin',
      passwordHash: await hashPassword(DEFAULT_ADMIN.password),
    },
  })
  console.log(`[LAEMU] Standard-Admin automatisch angelegt: ${DEFAULT_ADMIN.email}`)
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
  // Sicherheitsnetz: Standard-Admin anlegen, falls die DB noch leer ist.
  try {
    await ensureDefaultAdmin()
  } catch (e) {
    console.error('[LAEMU] Datenbank nicht bereit:', e)
    return {
      ok: false,
      error:
        'Datenbank ist nicht eingerichtet. Bitte einmalig „npm run setup“ ausführen.',
    }
  }

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

// Registriert ein neues Team-Mitglied (Selbst-Registrierung).
// Sicherheit:
//  - Existiert noch kein Konto, wird der erste Account als Admin angelegt
//    (Bootstrap, ohne Code).
//  - Andernfalls ist ein gültiger TEAM_REGISTRATION_CODE nötig; neue Konten
//    erhalten die Rolle 'editor'. Ohne gesetzten Code ist die Registrierung zu.
export async function register(input: {
  name: string
  email: string
  password: string
  code: string
}): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim()
  const email = input.email.toLowerCase().trim()
  const password = input.password

  if (!name || !email) return { ok: false, error: 'Bitte Name und E-Mail angeben.' }
  if (password.length < 6) return { ok: false, error: 'Das Passwort muss mindestens 6 Zeichen haben.' }

  const userCount = await db.teamUser.count()
  const isBootstrap = userCount === 0

  if (!isBootstrap) {
    const expected = process.env.TEAM_REGISTRATION_CODE
    if (!expected) {
      return { ok: false, error: 'Die Selbst-Registrierung ist deaktiviert. Bitte einen Admin um einen Zugang bitten.' }
    }
    if (input.code.trim() !== expected) {
      return { ok: false, error: 'Ungültiger Team-Code.' }
    }
  }

  const existing = await db.teamUser.findUnique({ where: { email } })
  if (existing) return { ok: false, error: 'Für diese E-Mail existiert bereits ein Konto.' }

  await db.teamUser.create({
    data: {
      name,
      email,
      role: isBootstrap ? 'admin' : 'editor',
      passwordHash: await hashPassword(password),
    },
  })

  // Direkt einloggen (setzt das Session-Cookie).
  return login(email, password)
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
