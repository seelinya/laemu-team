import Link from 'next/link'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'

export const dynamic = 'force-dynamic'

export default async function LehrpersonenPage() {
  const teachers = await db.teacher.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })

  return (
    <div>
      <PageHeader
        title="Lehrpersonen"
        subtitle="Profile der LAEMU-Lehrpersonen — werden Kursen und Lernvideos zugeordnet."
        action={
          <Link href="/admin/lehrpersonen/neu" className="btn-primary">
            + Lehrperson
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teachers.length === 0 && (
          <p className="px-1 py-8 font-sans text-sm text-text-secondary">Noch keine Lehrpersonen.</p>
        )}
        {teachers.map((t) => (
          <Link
            key={t.id}
            href={`/admin/lehrpersonen/${t.id}`}
            className="card p-4 flex items-center gap-3 hover:border-dark transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {t.imageUrl ? (
              <img src={t.imageUrl} alt={t.name} className="w-12 h-12 object-cover border border-border" />
            ) : (
              <div className="w-12 h-12 bg-background border border-border flex items-center justify-center text-text-secondary">
                🧑‍🏫
              </div>
            )}
            <div className="min-w-0">
              <p className="font-heading font-bold text-sm truncate">{t.name}</p>
              <p className="font-sans text-xs text-text-secondary truncate">
                {t.instrument || '—'} {t.handle && `· ${t.handle}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
