import { PrismaClient } from '@prisma/client'

// Prisma-Client als Singleton — verhindert zu viele Verbindungen im Dev-Modus
// (Hot-Reload) und teilt eine Instanz über die ganze App.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
