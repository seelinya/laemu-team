import Link from 'next/link'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { COURSE_TRACK_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function KursePage() {
  const courses = await db.course.findMany({
    orderBy: [{ track: 'asc' }, { sortOrder: 'asc' }],
    include: {
      instrument: true,
      _count: { select: { modules: true } },
    },
  })

  const tracks = ['starter', 'pro', 'allgemein']

  return (
    <div>
      <PageHeader
        title="Lehrgänge & Kurse"
        subtitle="Strukturierte Kurse mit Modulen und Lektionen — gruppiert nach Lehrgang-Strang."
        action={
          <Link href="/admin/kurse/neu" className="btn-primary">
            + Kurs
          </Link>
        }
      />

      {courses.length === 0 && (
        <p className="font-sans text-sm text-text-secondary">Noch keine Kurse angelegt.</p>
      )}

      <div className="space-y-8">
        {tracks.map((track) => {
          const list = courses.filter((c) => c.track === track)
          if (list.length === 0) return null
          return (
            <section key={track}>
              <h2 className="font-heading font-bold text-lg mb-3">{COURSE_TRACK_LABELS[track]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {list.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/kurse/${c.id}`}
                    className="card p-4 hover:border-dark transition-colors flex items-start gap-3"
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-sm truncate">{c.title}</h3>
                        <span
                          className={`pill ${c.published ? 'border-green-300 text-green-700 bg-green-50' : 'border-border text-text-secondary'}`}
                        >
                          {c.published ? 'Live' : 'Entwurf'}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-text-secondary mt-0.5 truncate">
                        {c.instrument?.label ?? 'Allgemein'} · {c._count.modules} Module
                        {c.teacherName && ` · ${c.teacherName}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
