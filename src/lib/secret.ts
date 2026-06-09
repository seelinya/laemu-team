// Liefert das Secret zum Signieren/Prüfen der Session-Cookies.
// Wird sowohl in der (Edge-)Middleware als auch in den Server-Funktionen genutzt
// — daher bewusst ohne weitere Imports (Edge-kompatibel).
//
// In Produktion UNBEDINGT AUTH_SECRET in der Umgebung setzen. Ist es nicht
// gesetzt, wird ein fester Entwicklungs-Fallback verwendet, damit die App nicht
// abstürzt (mit Warnung). So funktioniert die Anmeldung auch ohne .env sofort.
const DEV_FALLBACK_SECRET =
  'laemu-team-dev-fallback-secret-bitte-AUTH_SECRET-in-produktion-setzen'

let warned = false

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (secret && secret.length >= 16) return secret
  if (!warned && typeof console !== 'undefined') {
    warned = true
    console.warn(
      '[LAEMU] AUTH_SECRET ist nicht (ausreichend) gesetzt — verwende Entwicklungs-Fallback. In Produktion bitte AUTH_SECRET setzen!',
    )
  }
  return DEV_FALLBACK_SECRET
}

export function authSecretBytes(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret())
}

// ─── Offener Login (Auth-Bypass) ──────────────────────────────────────────────
// ACHTUNG: Ist dies aktiv, wird JEDE E-Mail/Passwort-Kombination akzeptiert —
// die Authentifizierung ist damit praktisch deaktiviert. Nur für interne/Test-
// Zwecke gedacht. Zum Abschalten: AUTH_ALLOW_ANY="false" in der Umgebung setzen.
export function authBypassEnabled(): boolean {
  return process.env.AUTH_ALLOW_ANY !== 'false'
}

