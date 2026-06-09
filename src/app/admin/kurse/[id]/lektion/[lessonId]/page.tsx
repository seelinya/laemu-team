import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { FileUploadField } from '@/components/ui/FileUploadField'
import { LESSON_TYPES, LESSON_TYPE_LABELS } from '@/lib/constants'
import { saveLesson, deleteLesson } from '@/app/admin/kurse/actions'

export const dynamic = 'force-dynamic'

export default async function LessonEditPage({
  params,
}: {
  params: { id: string; lessonId: string }
}) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: { module: { include: { course: true } } },
  })
  if (!lesson || lesson.module.courseId !== params.id) notFound()

  return (
    <div>
      <PageHeader
        title={lesson.title}
        subtitle={`Lektion · Modul „${lesson.module.title}“`}
        back={{ href: `/admin/kurse/${params.id}`, label: lesson.module.course.title }}
      />

      <form action={saveLesson} className="card p-6 space-y-5 max-w-2xl">
        <input type="hidden" name="id" value={lesson.id} />
        <input type="hidden" name="courseId" value={params.id} />

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_90px] gap-4">
          <div>
            <label className="field-label">Titel *</label>
            <input name="title" defaultValue={lesson.title} required className="field-input" />
          </div>
          <div>
            <label className="field-label">Dauer</label>
            <input name="durationLabel" defaultValue={lesson.durationLabel} placeholder="z.B. 12 min" className="field-input" />
          </div>
          <div>
            <label className="field-label">Pos.</label>
            <input type="number" name="sortOrder" defaultValue={lesson.sortOrder} className="field-input" />
          </div>
        </div>

        <div>
          <label className="field-label">Typ</label>
          <select name="type" defaultValue={lesson.type} className="field-input max-w-[220px]">
            {LESSON_TYPES.map((t) => (
              <option key={t} value={t}>
                {LESSON_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <FileUploadField
          name="videoUrl"
          label="Video"
          initial={lesson.videoUrl}
          accept="video/*"
          hint="Video hochladen oder Vimeo/YouTube-URL eintragen."
        />

        <div>
          <label className="field-label">Textinhalt</label>
          <textarea name="textContent" defaultValue={lesson.textContent} rows={6} className="field-textarea" />
        </div>

        <FileUploadField
          name="pdfUrl"
          label="PDF (Begleitmaterial / Noten)"
          initial={lesson.pdfUrl}
          accept="application/pdf"
          hint="PDF hochladen oder URL eintragen."
        />

        <label className="flex items-center gap-2 font-sans text-sm">
          <input type="checkbox" name="published" defaultChecked={lesson.published} />
          Veröffentlicht
        </label>

        <SubmitButton>Lektion speichern</SubmitButton>
      </form>

      <form action={deleteLesson} className="mt-3 max-w-2xl">
        <input type="hidden" name="id" value={lesson.id} />
        <input type="hidden" name="courseId" value={params.id} />
        <ConfirmSubmit message="Lektion löschen?">Lektion löschen</ConfirmSubmit>
      </form>
    </div>
  )
}
