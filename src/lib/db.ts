import { PrismaClient } from '@prisma/client'

// Fallback für DATABASE_URL: Ohne .env würde Prisma sonst beim Start abstürzen.
// Standard ist eine lokale SQLite-Datei. Für Produktion (z.B. Postgres) einfach
// DATABASE_URL in der Umgebung setzen.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

// Prisma-Client als Singleton — verhindert zu viele Verbindungen im Dev-Modus
// (Hot-Reload) und teilt eine Instanz über die ganze App.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
