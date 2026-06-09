import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { TAG_CATEGORIES, TAG_CATEGORY_LABELS } from '@/lib/constants'
import { addTag, deleteTag } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'

export const dynamic = 'force-dynamic'

export default async function TagsPage() {
  const tags = await db.tag.findMany({ orderBy: [{ category: 'asc' }, { value: 'asc' }] })
  const byCategory = (cat: string) => tags.filter((t) => t.category === cat)

  return (
    <div>
      <PageHeader
        title="Tags"
        subtitle="Vokabulare für die Lernvideo-Datenbank. Diese erscheinen als Vorschläge in den Stück-Formularen."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TAG_CATEGORIES.map((cat) => (
          <div key={cat} className="card p-5">
            <h2 className="font-heading font-bold text-base mb-3">{TAG_CATEGORY_LABELS[cat]}</h2>

            <div className="flex flex-wrap gap-1.5 mb-4 min-h-[28px]">
              {byCategory(cat).length === 0 && (
                <span className="font-sans text-xs text-text-secondary">Noch keine Tags.</span>
              )}
              {byCategory(cat).map((t) => (
                <form key={t.id} action={deleteTag} className="inline">
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs px-2 py-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                    title="Tag entfernen"
                  >
                    {t.value} <span className="opacity-60">✕</span>
                  </button>
                </form>
              ))}
            </div>

            <form action={addTag} className="flex gap-2">
              <input type="hidden" name="category" value={cat} />
              <input name="value" placeholder="Neuer Tag…" className="field-input flex-1" required />
              <SubmitButton variant="secondary" pendingLabel="…">
                +
              </SubmitButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
