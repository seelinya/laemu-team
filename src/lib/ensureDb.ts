import 'server-only'
import { execSync } from 'child_process'
import { db } from './db'
import { seedDatabase } from './seedData'

// Stellt zur Laufzeit sicher, dass die Datenbank einsatzbereit ist:
//  1. Fehlen die Tabellen, wird das Schema angelegt (`prisma db push`).
//  2. Ist die DB leer, wird sie mit den Demo-Inhalten befüllt.
// Wird einmal pro Prozess ausgeführt (memoisiert), damit Folgeaufrufe günstig sind.
//
// So sind die Inhalte sofort sichtbar — auch ohne vorheriges `npm run setup`.

let readyPromise: Promise<void> | null = null

export function ensureDbReady(): Promise<void> {
  if (!readyPromise) readyPromise = init()
  return readyPromise
}

async function init(): Promise<void> {
  let tablesExist = true
  try {
    await db.teamUser.count()
  } catch {
    tablesExist = false
  }

  if (!tablesExist) {
    try {
      // Schema in die DB schreiben (legt bei SQLite auch die Datei an).
      execSync('npx prisma db push --skip-generate --accept-data-loss', {
        cwd: process.cwd(),
        stdio: 'ignore',
      })
    } catch (e) {
      console.error('[LAEMU] Automatisches Einrichten der DB fehlgeschlagen:', e)
      // Trotzdem weiterversuchen — evtl. existieren die Tabellen doch.
    }
  }

  try {
    const count = await db.teamUser.count()
    if (count === 0) {
      await seedDatabase(db)
      console.log('[LAEMU] Datenbank automatisch eingerichtet & befüllt.')
    }
  } catch (e) {
    console.error('[LAEMU] Seeding zur Laufzeit fehlgeschlagen:', e)
    // Promise nicht „verbrennen“ — beim nächsten Request erneut versuchen.
    readyPromise = null
    throw e
  }
}
