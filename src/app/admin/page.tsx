import Link from 'next/link'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [instruments, courses, modules, lessons, pieces, publishedPieces, teachers, wishes, media] =
    await Promise.all([
      db.instrument.count(),
      db.course.count(),
      db.module.count(),
      db.lesson.count(),
      db.piece.count(),
      db.piece.count({ where: { published: true } }),
      db.teacher.count(),
      db.wish.count(),
      db.mediaAsset.count(),
    ])
  return { instruments, courses, modules, lessons, pieces, publishedPieces, teachers, wishes, media }
}

export default async function DashboardPage() {
  const stats = await getStats()
  const recentPieces = await db.piece.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })
  const recentCourses = await db.course.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: { instrument: true },
  })

  const cards = [
    { label: 'Instrumente', value: stats.instruments, href: '/admin/instrumente' },
    { label: 'Kurse', value: stats.courses, href: '/admin/kurse' },
    { label: 'Module', value: stats.modules, href: '/admin/kurse' },
    { label: 'Lektionen', value: stats.lessons, href: '/admin/kurse' },
    { label: 'Lernvideos', value: stats.pieces, href: '/admin/lernvideos' },
    { label: 'davon veröffentlicht', value: stats.publishedPieces, href: '/admin/lernvideos' },
    { label: 'Lehrpersonen', value: stats.teachers, href: '/admin/lehrpersonen' },
    { label: 'Stückwünsche', value: stats.wishes, href: '/admin/wuensche' },
  ]

  return (
    <div>
      <PageHeader
        title="Übersicht"
        subtitle="Willkommen im LAEMU Team-Backend. Hier verwaltest du alle Inhalte der Mitglieder-App."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="card p-4 hover:border-dark transition-colors"
          >
            <p className="font-heading text-3xl font-extrabold text-dark">{c.value}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-bold">Zuletzt bearbeitete Lernvideos</h2>
            <Link href="/admin/lernvideos" className="font-sans text-xs text-accent-gold hover:underline">
              Alle →
            </Link>
          </div>
          <div className="card divide-y divide-border">
            {recentPieces.length === 0 && (
              <p className="px-4 py-6 font-sans text-sm text-text-secondary">Noch keine Lernvideos.</p>
            )}
            {recentPieces.map((p) => (
              <Link
                key={p.id}
                href={`/admin/lernvideos/${p.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-background transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium truncate">{p.title}</p>
                  <p className="font-sans text-xs text-text-secondary truncate">
                    {p.artist || '—'} · {p.instrumentName || '—'}
                  </p>
                </div>
                <span
                  className={`pill ${p.published ? 'border-green-300 text-green-700 bg-green-50' : 'border-border text-text-secondary'}`}
                >
                  {p.published ? 'Live' : 'Entwurf'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-bold">Zuletzt bearbeitete Kurse</h2>
            <Link href="/admin/kurse" className="font-sans text-xs text-accent-gold hover:underline">
              Alle →
            </Link>
          </div>
          <div className="card divide-y divide-border">
            {recentCourses.length === 0 && (
              <p className="px-4 py-6 font-sans text-sm text-text-secondary">Noch keine Kurse.</p>
            )}
            {recentCourses.map((c) => (
              <Link
                key={c.id}
                href={`/admin/kurse/${c.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-background transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium truncate">
                    {c.emoji} {c.title}
                  </p>
                  <p className="font-sans text-xs text-text-secondary truncate">
                    {c.instrument?.label ?? 'Allgemein'} · {c.level}
                  </p>
                </div>
                <span
                  className={`pill ${c.published ? 'border-green-300 text-green-700 bg-green-50' : 'border-border text-text-secondary'}`}
                >
                  {c.published ? 'Live' : 'Entwurf'}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
