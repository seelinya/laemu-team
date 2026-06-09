import { saveTeacher, deleteTeacher } from '@/app/admin/lehrpersonen/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { FileUploadField } from '@/components/ui/FileUploadField'

type Teacher = {
  id: string
  name: string
  handle: string
  instrument: string
  bio: string
  imageUrl: string
  sortOrder: number
}

export function TeacherForm({ teacher }: { teacher?: Teacher }) {
  return (
    <div className="max-w-xl space-y-6">
      <form action={saveTeacher} className="card p-6 space-y-5">
        {teacher && <input type="hidden" name="id" value={teacher.id} />}
        <div>
          <label className="field-label">Name *</label>
          <input name="name" defaultValue={teacher?.name ?? ''} required className="field-input" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Handle</label>
            <input
              name="handle"
              defaultValue={teacher?.handle ?? ''}
              placeholder="@vorname_name"
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label">Instrument / Rolle</label>
            <input
              name="instrument"
              defaultValue={teacher?.instrument ?? ''}
              placeholder="z.B. Handorgel"
              className="field-input"
            />
          </div>
        </div>
        <div>
          <label className="field-label">Biografie</label>
          <textarea name="bio" defaultValue={teacher?.bio ?? ''} rows={3} className="field-textarea" />
        </div>
        <FileUploadField
          name="imageUrl"
          label="Profilbild"
          initial={teacher?.imageUrl ?? ''}
          accept="image/*"
          hint="Bild hochladen oder eine externe URL eintragen."
        />
        <div className="max-w-[140px]">
          <label className="field-label">Reihenfolge</label>
          <input type="number" name="sortOrder" defaultValue={teacher?.sortOrder ?? 0} className="field-input" />
        </div>
        <SubmitButton>Speichern</SubmitButton>
      </form>

      {teacher && (
        <form action={deleteTeacher}>
          <input type="hidden" name="id" value={teacher.id} />
          <ConfirmSubmit message="Lehrperson löschen?">Lehrperson löschen</ConfirmSubmit>
        </form>
      )}
    </div>
  )
}
