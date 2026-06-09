import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { parseRecord, parseStringArray } from '@/lib/json'
import { saveWish, deleteWish } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { TagInput } from '@/components/ui/TagInput'

export const dynamic = 'force-dynamic'

const VOICE_OPTIONS = [
  'Handorgel (1. Stimme)', 'Schwyzerörgeli (1. Stimme)', 'Klarinette (1. Stimme)',
  'Handorgel (2. Stimme)', 'Schwyzerörgeli (2. Stimme)', 'Klarinette (2. Stimme)',
  'Bassgeige', 'Klavierbegleitung',
]

const STATUS = [
  { value: 'offen', label: 'Offen' },
  { value: 'in_arbeit', label: 'In Arbeit' },
  { value: 'erledigt', label: 'Erledigt' },
]

function totalVotes(votes: Record<string, number>, available: string[]): number {
  return Object.entries(votes).reduce((s, [opt, n]) => s + (available.includes(opt) ? 0 : n), 0)
}

export default async function WuenschePage() {
  const wishes = await db.wish.findMany({ orderBy: { createdAt: 'desc' } })
  const enriched = wishes
    .map((w) => {
      const votes = parseRecord(w.votes)
      const available = parseStringArray(w.available)
      return { ...w, votesObj: votes, availableArr: available, total: totalVotes(votes, available) }
    })
    .sort((a, b) => b.total - a.total)

  return (
    <div>
      <PageHeader
        title="Stückwünsche"
        subtitle="Wünsche der Community. Markiere verfügbare Stimmen und setze den Status, sobald ein Stück produziert wird."
      />

      <details className="card p-4 mb-6">
        <summary className="font-sans text-sm font-medium cursor-pointer">+ Neuen Wunsch erfassen</summary>
        <form action={saveWish} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div>
            <label className="field-label">Titel *</label>
            <input name="title" required className="field-input" />
          </div>
          <div>
            <label className="field-label">Komponist</label>
            <input name="composer" className="field-input" />
          </div>
          <SubmitButton>Wunsch anlegen</SubmitButton>
        </form>
      </details>

      <div className="space-y-3">
        {enriched.length === 0 && (
          <p className="font-sans text-sm text-text-secondary">Noch keine Stückwünsche.</p>
        )}
        {enriched.map((w) => (
          <div key={w.id} className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-heading font-bold text-base">{w.title}</h3>
                <p className="font-sans text-xs text-text-secondary">
                  {w.composer || 'Komponist unbekannt'} · {w.total} Stimmen gesamt
                </p>
              </div>
              <span
                className={`pill ${
                  w.status === 'erledigt'
                    ? 'border-green-300 text-green-700 bg-green-50'
                    : w.status === 'in_arbeit'
                      ? 'border-accent-gold/40 text-accent-gold bg-accent-gold/10'
                      : 'border-border text-text-secondary'
                }`}
              >
                {STATUS.find((s) => s.value === w.status)?.label ?? w.status}
              </span>
            </div>

            {Object.keys(w.votesObj).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {Object.entries(w.votesObj)
                  .sort((a, b) => b[1] - a[1])
                  .map(([opt, n]) => (
                    <span
                      key={opt}
                      className={`pill ${w.availableArr.includes(opt) ? 'border-green-300 text-green-700 bg-green-50' : 'border-border text-text-secondary'}`}
                    >
                      {opt} · {n}
                      {w.availableArr.includes(opt) && ' ✓'}
                    </span>
                  ))}
              </div>
            )}

            <form action={saveWish} className="space-y-3 border-t border-border pt-4">
              <input type="hidden" name="id" value={w.id} />
              <input type="hidden" name="title" value={w.title} />
              <input type="hidden" name="composer" value={w.composer} />
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-start">
                <div>
                  <label className="field-label">Status</label>
                  <select name="status" defaultValue={w.status} className="field-input">
                    {STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <TagInput
                  name="available"
                  label="Bereits verfügbare Stimmen"
                  initial={w.availableArr}
                  suggestions={VOICE_OPTIONS}
                  placeholder="Stimme hinzufügen…"
                />
              </div>
              <div className="flex gap-2">
                <SubmitButton variant="secondary">Aktualisieren</SubmitButton>
                <span className="flex-1" />
              </div>
            </form>

            <form action={deleteWish} className="mt-2">
              <input type="hidden" name="id" value={w.id} />
              <ConfirmSubmit message="Wunsch löschen?" className="font-sans text-xs text-red-600 hover:underline">
                Löschen
              </ConfirmSubmit>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
