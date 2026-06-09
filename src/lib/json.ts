// Hilfsfunktionen zum Speichern von Listen/Objekten als JSON-String
// (SQLite hat keinen nativen JSON-Typ).

export function parseStringArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function stringifyArray(value: string[]): string {
  return JSON.stringify(value ?? [])
}

export function parseRecord(value: string | null | undefined): Record<string, number> {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

// Wandelt ein Komma-/Zeilen-getrenntes Textfeld in eine bereinigte Tag-Liste.
export function tagsFromInput(input: string | null | undefined): string[] {
  if (!input) return []
  return Array.from(
    new Set(
      input
        .split(/[\n,]/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  )
}
