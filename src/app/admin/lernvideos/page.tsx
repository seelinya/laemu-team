import Link from 'next/link'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { PageHeader } from '@/components/admin/PageHeader'
import { PLAN_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const PLAN_PILL: Record<string, string> = {
  free: 'border-border text-text-secondary',
  starter: 'border-accent-gold/30 text-accent-gold bg-accent-gold/10',
  pro: 'border-dark/20 text-dark bg-dark/5',
}

export default async function LernvideosPage({
  searchParams,
}: {
  searchParams: { q?: string; instrument?: string; plan?: string; status?: string }
}) {
  const { q, instrument, plan, status } = searchParams

  const where: Prisma.PieceWhereInput = {}
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { artist: { contains: q } },
      { composer: { contains: q } },
    ]
  }
  if (instrument) where.instrumentId = instrument
  if (plan) where.plan = plan
  if (status === 'published') where.published = true
  if (status === 'draft') where.published = false

  const [pieces, instruments] = await Promise.all([
    db.piece.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { voiceSections: true, sheets: true } } },
    }),
    db.instrument.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <div>
      <PageHeader
        title="Lernvideo-Datenbank"
        subtitle="Alle Stücke mit Stimmen, Noten/PDFs, Mixer und Tags."
        action={
          <Link href="/admin/lernvideos/neu" className="btn-primary">
            + Lernvideo
          </Link>
        }
      />

      {/* Filter */}
      <form className="card p-4 mb-5 grid grid-cols-1 sm:grid-cols-[1fr_180px_140px_140px_auto] gap-3 items-end">
        <div>
          <label className="field-label">Suche</label>
          <input name="q" defaultValue={q ?? ''} placeholder="Titel, Interpret, Komponist…" className="field-input" />
        </div>
        <div>
          <label className="field-label">Instrument</label>
          <select name="instrument" defaultValue={instrument ?? ''} className="field-input">
            <option value="">Alle</option>
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Abo</label>
          <select name="plan" defaultValue={plan ?? ''} className="field-input">
            <option value="">Alle</option>
            {Object.entries(PLAN_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Status</label>
          <select name="status" defaultValue={status ?? ''} className="field-input">
            <option value="">Alle</option>
            <option value="published">Veröffentlicht</option>
            <option value="draft">Entwurf</option>
          </select>
        </div>
        <button type="submit" className="btn-secondary">Filtern</button>
      </form>

      <p className="font-sans text-sm text-text-secondary mb-3">
        {pieces.length} {pieces.length === 1 ? 'Stück' : 'Stücke'}
      </p>

      <div className="card divide-y divide-border">
        {pieces.length === 0 && (
          <p className="px-4 py-8 font-sans text-sm text-text-secondary text-center">
            Keine Stücke gefunden.
          </p>
        )}
        {pieces.map((p) => (
          <Link
            key={p.id}
            href={`/admin/lernvideos/${p.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.imageUrl ? (
              <img src={p.imageUrl} alt="" className="w-14 h-10 object-cover border border-border flex-shrink-0" />
            ) : (
              <div className="w-14 h-10 bg-background border border-border flex-shrink-0 flex items-center justify-center text-text-secondary">
                ♪
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-medium truncate">{p.title}</p>
              <p className="font-sans text-xs text-text-secondary truncate">
                {p.artist || '—'} · {p.instrumentName || 'kein Instrument'}
                {p.taktart && ` · ${p.taktart}`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-sans text-[11px] text-text-secondary hidden sm:inline">
                {p._count.voiceSections} Stimmen · {p._count.sheets} Noten
              </span>
              <span className={`pill ${PLAN_PILL[p.plan] ?? ''}`}>{PLAN_LABELS[p.plan] ?? p.plan}</span>
              <span
                className={`pill ${p.published ? 'border-green-300 text-green-700 bg-green-50' : 'border-border text-text-secondary'}`}
              >
                {p.published ? 'Live' : 'Entwurf'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
