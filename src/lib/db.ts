import { PrismaClient } from '@prisma/client'
import os from 'os'
import path from 'path'

// Fallback für DATABASE_URL: Ohne explizite Konfiguration würde Prisma sonst
// beim Start abstürzen. Für einen Prototyp legen wir die SQLite-Datei an einen
// garantiert beschreibbaren Ort — sonst scheitert das Anlegen auf Hostings mit
// schreibgeschütztem Projektverzeichnis (z.B. Vercel/Lambda) und es kommt zu
// Fehlermeldungen beim Öffnen.
if (!process.env.DATABASE_URL) {
  const readOnlyHost =
    process.env.VERCEL ||
    process.env.AWS_REGION ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.NODE_ENV === 'production'
  const dir = readOnlyHost ? os.tmpdir() : process.cwd()
  process.env.DATABASE_URL = `file:${path.join(dir, 'laemu-team.db')}`
}

// Prisma-Client als Singleton — verhindert zu viele Verbindungen im Dev-Modus
// (Hot-Reload) und teilt eine Instanz über die ganze App.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
