// Läuft einmalig beim Serverstart (vor dem ersten Request).
// Richtet die Datenbank automatisch ein & befüllt sie — so sind die Inhalte
// sofort sichtbar, ohne separates `npm run setup`.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { ensureDbReady } = await import('./lib/ensureDb')
      await ensureDbReady()
    } catch (e) {
      console.error('[LAEMU] DB-Initialisierung beim Start fehlgeschlagen:', e)
    }
  }
}
