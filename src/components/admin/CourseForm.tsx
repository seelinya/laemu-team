import { saveCourse } from '@/app/admin/kurse/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { FileUploadField } from '@/components/ui/FileUploadField'
import { COURSE_TRACKS, COURSE_TRACK_LABELS, COURSE_LEVELS } from '@/lib/constants'

type Course = {
  id: string
  slug: string
  title: string
  description: string
  track: string
  level: string
  emoji: string
  imageUrl: string
  durationLabel: string
  teacherName: string
  sortOrder: number
  published: boolean
  instrumentId: string | null
}

type Instrument = { id: string; label: string; emoji: string }
type Teacher = { id: string; name: string }

export function CourseForm({
  course,
  instruments,
  teachers,
}: {
  course?: Course
  instruments: Instrument[]
  teachers: Teacher[]
}) {
  return (
    <form action={saveCourse} className="card p-6 space-y-5 max-w-2xl">
      {course && <input type="hidden" name="id" value={course.id} />}

      <div className="grid grid-cols-[80px_1fr] gap-4">
        <div>
          <label className="field-label">Emoji</label>
          <input name="emoji" defaultValue={course?.emoji ?? '🎓'} className="field-input text-center" />
        </div>
        <div>
          <label className="field-label">Kurstitel *</label>
          <input name="title" defaultValue={course?.title ?? ''} required className="field-input" />
        </div>
      </div>

      <div>
        <label className="field-label">Beschreibung</label>
        <textarea name="description" defaultValue={course?.description ?? ''} rows={2} className="field-textarea" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="field-label">Instrument</label>
          <select name="instrumentId" defaultValue={course?.instrumentId ?? ''} className="field-input">
            <option value="">— Allgemein —</option>
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.emoji} {i.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Lehrgang-Strang</label>
          <select name="track" defaultValue={course?.track ?? 'starter'} className="field-input">
            {COURSE_TRACKS.map((t) => (
              <option key={t} value={t}>
                {COURSE_TRACK_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Level (Anzeige)</label>
          <select name="level" defaultValue={course?.level ?? 'Starter'} className="field-input">
            {COURSE_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="field-label">Lehrperson</label>
          <input
            name="teacherName"
            defaultValue={course?.teacherName ?? ''}
            list="teacher-list"
            placeholder="Name"
            className="field-input"
          />
          <datalist id="teacher-list">
            {teachers.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="field-label">Dauer (Label)</label>
          <input name="durationLabel" defaultValue={course?.durationLabel ?? ''} placeholder="z.B. 8h" className="field-input" />
        </div>
        <div>
          <label className="field-label">Reihenfolge</label>
          <input type="number" name="sortOrder" defaultValue={course?.sortOrder ?? 0} className="field-input" />
        </div>
      </div>

      <FileUploadField
        name="imageUrl"
        label="Titelbild"
        initial={course?.imageUrl ?? ''}
        accept="image/*"
        hint="Bild hochladen oder externe URL eintragen."
      />

      <div>
        <label className="field-label">Slug (optional)</label>
        <input name="slug" defaultValue={course?.slug ?? ''} placeholder="automatisch aus Titel" className="field-input" />
      </div>

      <label className="flex items-center gap-2 font-sans text-sm">
        <input type="checkbox" name="published" defaultChecked={course?.published ?? false} />
        Veröffentlicht (in der Mitglieder-App sichtbar)
      </label>

      <SubmitButton>Kurs speichern</SubmitButton>
    </form>
  )
}
