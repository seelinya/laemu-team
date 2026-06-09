import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { CourseForm } from '@/components/admin/CourseForm'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { MODULE_STATUSES, MODULE_STATUS_LABELS, LESSON_TYPE_LABELS } from '@/lib/constants'
import {
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  deleteLesson,
} from '../actions'

export const dynamic = 'force-dynamic'

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, instruments, teachers] = await Promise.all([
    db.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: { lessons: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    }),
    db.instrument.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.teacher.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!course) notFound()

  const lessonCount = course.modules.reduce((s, m) => s + m.lessons.length, 0)

  return (
    <div>
      <PageHeader
        title={`${course.emoji} ${course.title}`}
        subtitle={`${course.modules.length} Module · ${lessonCount} Lektionen`}
        back={{ href: '/admin/kurse', label: 'Kurse' }}
      />

      <details className="mb-8">
        <summary className="font-heading font-bold text-base cursor-pointer mb-3">
          Kursdaten bearbeiten
        </summary>
        <div className="mt-3">
          <CourseForm course={course} instruments={instruments} teachers={teachers} />
          <form action={deleteCourse} className="mt-3 max-w-2xl">
            <input type="hidden" name="id" value={course.id} />
            <ConfirmSubmit message="Kurs inkl. aller Module & Lektionen löschen?">
              Kurs löschen
            </ConfirmSubmit>
          </form>
        </div>
      </details>

      <h2 className="font-heading font-bold text-xl mb-4">Module & Lektionen</h2>

      <div className="space-y-5">
        {course.modules.map((m) => (
          <div key={m.id} className="card p-4">
            <form action={updateModule} className="grid grid-cols-1 md:grid-cols-[1fr_180px_90px_auto] gap-2 items-end">
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="courseId" value={course.id} />
              <div>
                <label className="field-label">Modultitel</label>
                <input name="title" defaultValue={m.title} className="field-input" />
              </div>
              <div>
                <label className="field-label">Standardstatus</label>
                <select name="status" defaultValue={m.status} className="field-input">
                  {MODULE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {MODULE_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Pos.</label>
                <input type="number" name="sortOrder" defaultValue={m.sortOrder} className="field-input" />
              </div>
              <SubmitButton variant="secondary">Speichern</SubmitButton>
            </form>

            <div className="mt-4 border-t border-border pt-3 divide-y divide-border">
              {m.lessons.length === 0 && (
                <p className="font-sans text-xs text-text-secondary py-2">Noch keine Lektionen.</p>
              )}
              {m.lessons.map((l) => (
                <div key={l.id} className="flex items-center gap-3 py-2">
                  <span className="font-sans text-xs text-text-secondary w-6">{l.sortOrder + 1}.</span>
                  <Link
                    href={`/admin/kurse/${course.id}/lektion/${l.id}`}
                    className="flex-1 min-w-0 hover:text-accent-gold transition-colors"
                  >
                    <span className="font-sans text-sm font-medium">{l.title}</span>
                    <span className="font-sans text-xs text-text-secondary ml-2">
                      {LESSON_TYPE_LABELS[l.type]} {l.durationLabel && `· ${l.durationLabel}`}
                    </span>
                  </Link>
                  {!l.published && <span className="pill border-border text-text-secondary">Entwurf</span>}
                  <Link
                    href={`/admin/kurse/${course.id}/lektion/${l.id}`}
                    className="font-sans text-xs text-accent-gold hover:underline"
                  >
                    bearbeiten →
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 items-end">
              <form action={createLesson} className="flex gap-2 items-end flex-1 min-w-[240px]">
                <input type="hidden" name="moduleId" value={m.id} />
                <input type="hidden" name="courseId" value={course.id} />
                <input name="title" placeholder="Neue Lektion…" required className="field-input flex-1" />
                <SubmitButton variant="secondary" pendingLabel="…">
                  + Lektion
                </SubmitButton>
              </form>
              <form action={deleteModule}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="courseId" value={course.id} />
                <ConfirmSubmit
                  message="Modul inkl. Lektionen löschen?"
                  className="font-sans text-xs text-red-600 hover:underline px-2 py-2"
                >
                  Modul löschen
                </ConfirmSubmit>
              </form>
            </div>
          </div>
        ))}
      </div>

      <form action={createModule} className="mt-6 card p-4 flex gap-2 items-end max-w-lg">
        <input type="hidden" name="courseId" value={course.id} />
        <div className="flex-1">
          <label className="field-label">Neues Modul</label>
          <input name="title" placeholder="Modultitel…" required className="field-input" />
        </div>
        <SubmitButton>+ Modul</SubmitButton>
      </form>
    </div>
  )
}
