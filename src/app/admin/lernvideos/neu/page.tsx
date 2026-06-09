import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { PieceForm } from '@/components/admin/PieceForm'
import { loadTagSuggestions } from '@/lib/suggestions'

export const dynamic = 'force-dynamic'

export default async function NeuPiecePage() {
  const [instruments, teachers, suggestions] = await Promise.all([
    db.instrument.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.teacher.findMany({ orderBy: { name: 'asc' } }),
    loadTagSuggestions(),
  ])

  return (
    <div>
      <PageHeader
        title="Neues Lernvideo / Stück"
        subtitle="Grunddaten erfassen — Stimmen, Noten und Mixer kannst du danach hinzufügen."
        back={{ href: '/admin/lernvideos', label: 'Lernvideo-Datenbank' }}
      />
      <PieceForm
        instruments={instruments}
        teachers={teachers}
        stilSuggestions={suggestions.stil}
        genreSuggestions={suggestions.genre}
        taktSuggestions={suggestions.taktart}
        autoSuggestions={suggestions.auto}
      />
    </div>
  )
}
