import { saveInstrument, deleteInstrument } from '@/app/admin/instrumente/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'

type Instrument = {
  id: string
  slug: string
  label: string
  emoji: string
  description: string
  sortOrder: number
}

export function InstrumentForm({ instrument }: { instrument?: Instrument }) {
  return (
    <div className="max-w-xl space-y-6">
      <form action={saveInstrument} className="card p-6 space-y-5">
        {instrument && <input type="hidden" name="id" value={instrument.id} />}
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div>
            <label className="field-label">Emoji</label>
            <input name="emoji" defaultValue={instrument?.emoji ?? '🎵'} className="field-input text-center" />
          </div>
          <div>
            <label className="field-label">Bezeichnung *</label>
            <input name="label" defaultValue={instrument?.label ?? ''} required className="field-input" />
          </div>
        </div>
        <div>
          <label className="field-label">Slug (URL-Kürzel)</label>
          <input
            name="slug"
            defaultValue={instrument?.slug ?? ''}
            placeholder="z.B. handorgel — leer lassen für automatisch"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Beschreibung</label>
          <textarea
            name="description"
            defaultValue={instrument?.description ?? ''}
            rows={2}
            className="field-textarea"
          />
        </div>
        <div className="max-w-[140px]">
          <label className="field-label">Reihenfolge</label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={instrument?.sortOrder ?? 0}
            className="field-input"
          />
        </div>
        <div className="flex gap-2">
          <SubmitButton>Speichern</SubmitButton>
        </div>
      </form>

      {instrument && (
        <form action={deleteInstrument}>
          <input type="hidden" name="id" value={instrument.id} />
          <ConfirmSubmit message="Instrument löschen? Zugeordnete Kurse/Stücke verlieren die Zuordnung.">
            Instrument löschen
          </ConfirmSubmit>
        </form>
      )}
    </div>
  )
}
