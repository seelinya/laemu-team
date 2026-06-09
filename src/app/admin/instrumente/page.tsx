import Link from 'next/link'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'

export const dynamic = 'force-dynamic'

export default async function InstrumentePage() {
  const instruments = await db.instrument.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { courses: true, pieces: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Instrumente"
        subtitle="Die Instrumente der LAEMU-Academy. Lehrgänge und Lernvideos werden ihnen zugeordnet."
        action={
          <Link href="/admin/instrumente/neu" className="btn-primary">
            + Instrument
          </Link>
        }
      />

      <div className="card divide-y divide-border">
        {instruments.length === 0 && (
          <p className="px-4 py-8 font-sans text-sm text-text-secondary text-center">
            Noch keine Instrumente angelegt.
          </p>
        )}
        {instruments.map((i) => (
          <Link
            key={i.id}
            href={`/admin/instrumente/${i.id}`}
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-background transition-colors"
          >
            <span className="text-2xl">{i.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-sm">{i.label}</p>
              <p className="font-sans text-xs text-text-secondary truncate">
                /{i.slug} · {i.description || 'keine Beschreibung'}
              </p>
            </div>
            <div className="text-right font-sans text-xs text-text-secondary">
              {i._count.courses} Kurse · {i._count.pieces} Stücke
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
