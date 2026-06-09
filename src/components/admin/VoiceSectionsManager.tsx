import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { RepeatableList } from '@/components/admin/RepeatableList'
import {
  addVoiceSection, updateVoiceSection, deleteVoiceSection,
  addVoiceVideo, deleteVoiceVideo,
  addSectionSheet, deleteSheet,
  addAudioSample, deleteAudioSample,
} from '@/app/admin/lernvideos/actions'

type Section = {
  id: string
  label: string
  instrument: string
  color: string
  hasLaemuPlayer: boolean
  sortOrder: number
  videos: { id: string; label: string; durationLabel: string; videoUrl: string }[]
  sheets: { id: string; label: string; sheetKey: string; price: number; pdfUrl: string }[]
  audioSamples: { id: string; label: string; durationLabel: string; type: string; url: string }[]
}

export function VoiceSectionsManager({
  pieceId,
  sections,
}: {
  pieceId: string
  sections: Section[]
}) {
  return (
    <div className="space-y-6">
      {sections.map((s) => (
        <div key={s.id} className="card p-5" style={{ borderLeft: `4px solid ${s.color}` }}>
          {/* Kopf: Stimme bearbeiten */}
          <form action={updateVoiceSection} className="grid grid-cols-1 md:grid-cols-[1fr_140px_70px_70px_auto] gap-2 items-end">
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="pieceId" value={pieceId} />
            <div>
              <label className="field-label">Stimme</label>
              <input name="label" defaultValue={s.label} className="field-input" />
            </div>
            <div>
              <label className="field-label">Instrument</label>
              <input name="instrument" defaultValue={s.instrument} className="field-input" />
            </div>
            <div>
              <label className="field-label">Farbe</label>
              <input type="color" name="color" defaultValue={s.color} className="field-input h-[42px] p-1" />
            </div>
            <div>
              <label className="field-label">Pos.</label>
              <input type="number" name="sortOrder" defaultValue={s.sortOrder} className="field-input" />
            </div>
            <SubmitButton variant="secondary">Speichern</SubmitButton>
            <label className="md:col-span-5 flex items-center gap-2 font-sans text-xs mt-1">
              <input type="checkbox" name="hasLaemuPlayer" defaultChecked={s.hasLaemuPlayer} />
              LAEMU-Player (Mehrspur-Mixer) für diese Stimme
            </label>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="field-label">Lernvideos</p>
              <RepeatableList
                items={s.videos.map((v) => ({
                  id: v.id,
                  primary: v.label,
                  secondary: v.durationLabel,
                  link: v.videoUrl,
                }))}
                addAction={addVoiceVideo}
                deleteAction={deleteVoiceVideo}
                hiddenFields={{ sectionId: s.id, pieceId }}
                addLabel="+ Lernvideo"
                fields={[
                  { name: 'label', label: 'Titel', required: true },
                  { name: 'durationLabel', label: 'Dauer', placeholder: '12 Min.' },
                  { name: 'videoUrl', label: 'Video', upload: true, accept: 'video/*' },
                ]}
              />
            </div>

            <div>
              <p className="field-label">Noten</p>
              <RepeatableList
                items={s.sheets.map((sh) => ({
                  id: sh.id,
                  primary: sh.label,
                  secondary: `${sh.sheetKey || '—'} · CHF ${sh.price}`,
                  link: sh.pdfUrl,
                }))}
                addAction={addSectionSheet}
                deleteAction={deleteSheet}
                hiddenFields={{ sectionId: s.id, pieceId }}
                addLabel="+ Note / PDF"
                fields={[
                  { name: 'label', label: 'Bezeichnung', required: true },
                  { name: 'sheetKey', label: 'Key', placeholder: 'violin / griff' },
                  { name: 'price', label: 'Preis', type: 'number' },
                  { name: 'pdfUrl', label: 'PDF', upload: true, accept: 'application/pdf' },
                ]}
              />
            </div>

            <div>
              <p className="field-label">Audio-Beispiele</p>
              <RepeatableList
                items={s.audioSamples.map((a) => ({
                  id: a.id,
                  primary: a.label,
                  secondary: `${a.type} · ${a.durationLabel}`,
                  link: a.url,
                }))}
                addAction={addAudioSample}
                deleteAction={deleteAudioSample}
                hiddenFields={{ sectionId: s.id, pieceId }}
                addLabel="+ Audio"
                fields={[
                  { name: 'label', label: 'Bezeichnung', required: true },
                  { name: 'durationLabel', label: 'Dauer', placeholder: '3:42' },
                  { name: 'type', label: 'Typ', type: 'select', options: ['audio', 'youtube'] },
                  { name: 'url', label: 'Audio', upload: true, accept: 'audio/*' },
                ]}
              />
            </div>
          </div>

          <form action={deleteVoiceSection} className="mt-3">
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="pieceId" value={pieceId} />
            <ConfirmSubmit
              message={`Stimme „${s.label}“ inkl. Videos/Noten/Audios löschen?`}
              className="font-sans text-xs text-red-600 hover:underline"
            >
              Stimme löschen
            </ConfirmSubmit>
          </form>
        </div>
      ))}

      {/* Neue Stimme */}
      <form action={addVoiceSection} className="card p-5 grid grid-cols-1 sm:grid-cols-[1fr_160px_90px_auto] gap-3 items-end">
        <input type="hidden" name="pieceId" value={pieceId} />
        <div>
          <label className="field-label">Neue Stimme</label>
          <input name="label" placeholder="z.B. 1. Stimme Handorgel" required className="field-input" />
        </div>
        <div>
          <label className="field-label">Instrument</label>
          <input name="instrument" placeholder="Handorgel" className="field-input" />
        </div>
        <div>
          <label className="field-label">Farbe</label>
          <input type="color" name="color" defaultValue="#C4973A" className="field-input h-[42px] p-1" />
        </div>
        <SubmitButton>+ Stimme</SubmitButton>
      </form>
    </div>
  )
}
