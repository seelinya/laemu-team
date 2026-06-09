import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { FileUploadField } from '@/components/ui/FileUploadField'

export type RLField = {
  name: string
  label: string
  required?: boolean
  placeholder?: string
  type?: 'text' | 'number' | 'color' | 'select'
  options?: string[]
  upload?: boolean
  accept?: string
}

export type RLItem = {
  id: string
  primary: string
  secondary?: string
  link?: string
  color?: string
}

type ServerAction = (formData: FormData) => void | Promise<void>

// Generische Liste mit "Hinzufügen"-Formular und Löschen je Eintrag.
// Wird für Noten, Mixer-Spuren, Aufnahmen, Tonträger u.ä. wiederverwendet.
export function RepeatableList({
  items,
  addAction,
  deleteAction,
  hiddenFields = {},
  fields,
  addLabel = '+ Hinzufügen',
}: {
  items: RLItem[]
  addAction: ServerAction
  deleteAction: ServerAction
  hiddenFields?: Record<string, string>
  fields: RLField[]
  addLabel?: string
}) {
  return (
    <div className="card">
      <div className="divide-y divide-border">
        {items.length === 0 && (
          <p className="px-4 py-3 font-sans text-xs text-text-secondary">Noch keine Einträge.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
            {item.color && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-medium truncate">{item.primary}</p>
              {item.secondary && (
                <p className="font-sans text-xs text-text-secondary truncate">{item.secondary}</p>
              )}
            </div>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] text-accent-gold hover:underline flex-shrink-0"
              >
                öffnen ↗
              </a>
            )}
            <form action={deleteAction} className="flex-shrink-0">
              <input type="hidden" name="id" value={item.id} />
              {Object.entries(hiddenFields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              <ConfirmSubmit
                message="Eintrag löschen?"
                className="font-sans text-[11px] text-red-600 hover:underline"
              >
                ✕
              </ConfirmSubmit>
            </form>
          </div>
        ))}
      </div>

      <details className="border-t border-border">
        <summary className="px-4 py-2.5 font-sans text-sm text-accent-gold cursor-pointer hover:bg-background">
          {addLabel}
        </summary>
        <form action={addAction} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-background/50">
          {Object.entries(hiddenFields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          {fields.map((f) => (
            <div key={f.name} className={f.upload || f.type === 'select' ? 'sm:col-span-2' : ''}>
              {f.upload ? (
                <FileUploadField name={f.name} label={f.label} accept={f.accept} />
              ) : f.type === 'select' ? (
                <>
                  <label className="field-label">{f.label}</label>
                  <select name={f.name} className="field-input">
                    {(f.options ?? []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className="field-label">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type ?? 'text'}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="field-input"
                  />
                </>
              )}
            </div>
          ))}
          <div className="sm:col-span-2">
            <SubmitButton variant="secondary">Eintrag hinzufügen</SubmitButton>
          </div>
        </form>
      </details>
    </div>
  )
}
