import 'server-only'
import { db } from './db'
import { seedDatabase } from './seedData'
import { SCHEMA_SQL } from './schemaSql'

// Stellt zur Laufzeit sicher, dass die Datenbank einsatzbereit ist:
//  1. Tabellen anlegen (aus eingebettetem Schema-SQL — ohne Prisma-CLI/Netzwerk).
//  2. Ist die DB leer, mit den Demo-Inhalten befüllen.
// Einmal pro Prozess (memoisiert). So sind die Inhalte sofort sichtbar — ohne
// vorheriges `npm run setup` und unabhängig von der Umgebung.

let readyPromise: Promise<void> | null = null

export function ensureDbReady(): Promise<void> {
  if (!readyPromise) readyPromise = init()
  return readyPromise
}

async function createSchema(): Promise<void> {
  // SQL in einzelne Statements zerlegen, Kommentarzeilen (-- …) entfernen
  // und nacheinander ausführen.
  const statements = SCHEMA_SQL.split(';')
    .map((chunk) =>
      chunk
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim(),
    )
    .filter((s) => s.length > 0)

  for (const stmt of statements) {
    try {
      await db.$executeRawUnsafe(stmt)
    } catch (e) {
      // "already exists" o.ä. ignorieren (Statements sind idempotent gedacht).
      const msg = e instanceof Error ? e.message : String(e)
      if (!/already exists/i.test(msg)) {
        console.error('[LAEMU] Schema-Statement fehlgeschlagen:', msg)
      }
    }
  }
}

async function init(): Promise<void> {
  try {
    // Tabellen anlegen, falls noch nicht vorhanden (idempotent).
    await createSchema()

    // Befüllen, falls leer.
    const count = await db.teamUser.count()
    if (count === 0) {
      await seedDatabase(db)
      console.log('[LAEMU] Datenbank automatisch eingerichtet & befüllt.')
    }
  } catch (e) {
    console.error('[LAEMU] DB-Initialisierung fehlgeschlagen:', e)
    // Promise nicht „verbrennen“ — beim nächsten Aufruf erneut versuchen.
    readyPromise = null
    throw e
  }
}
