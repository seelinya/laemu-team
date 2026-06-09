import { db } from './db'
import { STIL_TAGS, GENRE_TAGS, TAKTARTEN } from './constants'

// Lädt Tag-Vorschläge aus den Konstanten + der verwalteten Tag-Tabelle.
export async function loadTagSuggestions() {
  const tags = await db.tag.findMany()
  const byCat = (cat: string) => tags.filter((t) => t.category === cat).map((t) => t.value)

  const merge = (base: readonly string[], extra: string[]) =>
    Array.from(new Set([...base, ...extra]))

  return {
    stil: merge(STIL_TAGS, byCat('stil')),
    genre: merge(GENRE_TAGS, byCat('genre')),
    taktart: merge(TAKTARTEN, byCat('taktart')),
    auto: byCat('auto'),
  }
}
