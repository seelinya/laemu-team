import { savePiece } from '@/app/admin/lernvideos/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { FileUploadField } from '@/components/ui/FileUploadField'
import { TagInput } from '@/components/ui/TagInput'
import { parseStringArray } from '@/lib/json'
import {
  PLANS, PLAN_LABELS, ART_DES_STUECKES, ART_LABELS, TAKTARTEN,
} from '@/lib/constants'

type Piece = {
  id: string
  slug: string
  title: string
  artist: string
  composer: string
  year: number | null
  formation: string
  artDesStueckes: string
  taktart: string
  plan: string
  difficultyNum: number
  level: number
  stufen: number
  meter: string
  intro: string
  lyrics: string
  spotifyUrl: string
  imageUrl: string
  masterVideoUrl: string
  hasMixer: boolean
  hasViolin: boolean
  hasGriff: boolean
  price: number
  published: boolean
  styleTags: string
  melodieTags: string
  autoTags: string
  formations: string
  instrumentId: string | null
  teachers?: { id: string }[]
}

type Instrument = { id: string; label: string; emoji: string }
type Teacher = { id: string; name: string; instrument: string }

export function PieceForm({
  piece,
  instruments,
  teachers,
  stilSuggestions,
  genreSuggestions,
  taktSuggestions,
  autoSuggestions,
}: {
  piece?: Piece
  instruments: Instrument[]
  teachers: Teacher[]
  stilSuggestions: string[]
  genreSuggestions: string[]
  taktSuggestions: string[]
  autoSuggestions: string[]
}) {
  const selectedTeachers = new Set((piece?.teachers ?? []).map((t) => t.id))

  return (
    <form action={savePiece} className="space-y-6 max-w-3xl">
      {piece && <input type="hidden" name="id" value={piece.id} />}

      {/* ── Grunddaten ── */}
      <section className="card p-6 space-y-5">
        <h2 className="font-heading font-bold text-base">Grunddaten</h2>
        <div>
          <label className="field-label">Titel *</label>
          <input name="title" defaultValue={piece?.title ?? ''} required className="field-input" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Interpret / Kapelle</label>
            <input name="artist" defaultValue={piece?.artist ?? ''} className="field-input" />
          </div>
          <div>
            <label className="field-label">Komponist</label>
            <input name="composer" defaultValue={piece?.composer ?? ''} className="field-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Jahr</label>
            <input type="number" name="year" defaultValue={piece?.year ?? ''} className="field-input" />
          </div>
          <div>
            <label className="field-label">Instrument</label>
            <select name="instrumentId" defaultValue={piece?.instrumentId ?? ''} className="field-input">
              <option value="">— keines —</option>
              {instruments.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.emoji} {i.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Formation</label>
            <input name="formation" defaultValue={piece?.formation ?? ''} placeholder="Trio, Kapelle…" className="field-input" />
          </div>
        </div>
      </section>

      {/* ── Klassifizierung & Tags ── */}
      <section className="card p-6 space-y-5">
        <h2 className="font-heading font-bold text-base">Klassifizierung & Tags</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Art des Stückes</label>
            <select name="artDesStueckes" defaultValue={piece?.artDesStueckes ?? 'volkstuemlich'} className="field-input">
              {ART_DES_STUECKES.map((a) => (
                <option key={a} value={a}>
                  {ART_LABELS[a]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Taktart</label>
            <input name="taktart" defaultValue={piece?.taktart ?? ''} list="takt-list" className="field-input" />
            <datalist id="takt-list">
              {[...new Set([...TAKTARTEN, ...taktSuggestions])].map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </div>

        <TagInput
          name="styleTags"
          label="Stil-Tags (volkstümlich)"
          initial={parseStringArray(piece?.styleTags)}
          suggestions={stilSuggestions}
        />
        <TagInput
          name="melodieTags"
          label="Genre-Tags (bekannte Melodie)"
          initial={parseStringArray(piece?.melodieTags)}
          suggestions={genreSuggestions}
        />
        <TagInput
          name="autoTags"
          label="Auto-Tags (Suche)"
          initial={parseStringArray(piece?.autoTags)}
          suggestions={autoSuggestions}
        />
        <TagInput
          name="formations"
          label="Bekannte Formationen"
          initial={parseStringArray(piece?.formations)}
          placeholder="Formation hinzufügen…"
        />
      </section>

      {/* ── Schwierigkeit & Zugang ── */}
      <section className="card p-6 space-y-5">
        <h2 className="font-heading font-bold text-base">Schwierigkeit & Zugang</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="field-label">Abo-Stufe</label>
            <select name="plan" defaultValue={piece?.plan ?? 'free'} className="field-input">
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {PLAN_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Schwierigkeit (1–5)</label>
            <input type="number" min={1} max={5} name="difficultyNum" defaultValue={piece?.difficultyNum ?? 1} className="field-input" />
          </div>
          <div>
            <label className="field-label">Level</label>
            <input type="number" name="level" defaultValue={piece?.level ?? 1} className="field-input" />
          </div>
          <div>
            <label className="field-label">Stufen</label>
            <input type="number" name="stufen" defaultValue={piece?.stufen ?? 1} className="field-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Takt / Meter</label>
            <input name="meter" defaultValue={piece?.meter ?? ''} placeholder="z.B. 3/4" className="field-input" />
          </div>
          <div>
            <label className="field-label">Preis (CHF)</label>
            <input type="number" name="price" defaultValue={piece?.price ?? 0} className="field-input" />
          </div>
        </div>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 font-sans text-sm">
            <input type="checkbox" name="hasViolin" defaultChecked={piece?.hasViolin ?? false} /> Violinschlüssel-Noten
          </label>
          <label className="flex items-center gap-2 font-sans text-sm">
            <input type="checkbox" name="hasGriff" defaultChecked={piece?.hasGriff ?? false} /> Griffschrift-Noten
          </label>
          <label className="flex items-center gap-2 font-sans text-sm">
            <input type="checkbox" name="hasMixer" defaultChecked={piece?.hasMixer ?? false} /> Mixer verfügbar
          </label>
        </div>
      </section>

      {/* ── Medien & Texte ── */}
      <section className="card p-6 space-y-5">
        <h2 className="font-heading font-bold text-base">Medien & Texte</h2>
        <FileUploadField name="imageUrl" label="Titelbild / Thumbnail" initial={piece?.imageUrl ?? ''} accept="image/*" />
        <FileUploadField
          name="masterVideoUrl"
          label="Master-Video"
          initial={piece?.masterVideoUrl ?? ''}
          accept="video/*"
          hint="Master-Aufnahme hochladen oder Vimeo/YouTube-URL eintragen."
        />
        <div>
          <label className="field-label">Spotify-URL</label>
          <input name="spotifyUrl" defaultValue={piece?.spotifyUrl ?? ''} className="field-input" />
        </div>
        <div>
          <label className="field-label">Einführungstext</label>
          <textarea name="intro" defaultValue={piece?.intro ?? ''} rows={4} className="field-textarea" />
        </div>
        <div>
          <label className="field-label">Liedtext / Lyrics</label>
          <textarea name="lyrics" defaultValue={piece?.lyrics ?? ''} rows={5} className="field-textarea font-mono text-xs" />
        </div>
      </section>

      {/* ── Lehrpersonen ── */}
      <section className="card p-6 space-y-3">
        <h2 className="font-heading font-bold text-base">Beteiligte Lehrpersonen</h2>
        {teachers.length === 0 ? (
          <p className="font-sans text-xs text-text-secondary">
            Noch keine Lehrpersonen angelegt.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {teachers.map((t) => (
              <label key={t.id} className="flex items-center gap-2 font-sans text-sm border border-border px-3 py-2">
                <input
                  type="checkbox"
                  name="teacherIds"
                  value={t.id}
                  defaultChecked={selectedTeachers.has(t.id)}
                />
                <span className="truncate">
                  {t.name}
                  {t.instrument && <span className="text-text-secondary"> · {t.instrument}</span>}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 font-sans text-sm">
          <input type="checkbox" name="published" defaultChecked={piece?.published ?? false} />
          Veröffentlicht
        </label>
        <input type="hidden" name="slug" value={piece?.slug ?? ''} />
        <SubmitButton>Stück speichern</SubmitButton>
      </div>
    </form>
  )
}
