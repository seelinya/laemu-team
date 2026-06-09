import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { PieceForm } from '@/components/admin/PieceForm'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { loadTagSuggestions } from '@/lib/suggestions'
import { deletePiece } from '../actions'
import { VoiceSectionsManager } from '@/components/admin/VoiceSectionsManager'
import { RepeatableList } from '@/components/admin/RepeatableList'
import {
  addPieceSheet, deleteSheet,
  addMixerMusician, deleteMixerMusician,
  addOriginalRecording, deleteOriginalRecording,
  addTontraeger, deleteTontraeger,
} from '../actions'

export const dynamic = 'force-dynamic'

export default async function PieceDetailPage({ params }: { params: { id: string } }) {
  const [piece, instruments, teachers, suggestions] = await Promise.all([
    db.piece.findUnique({
      where: { id: params.id },
      include: {
        teachers: true,
        sheets: { where: { sectionId: null }, orderBy: { sortOrder: 'asc' } },
        mixerMusicians: { orderBy: { sortOrder: 'asc' } },
        originalRecordings: { orderBy: { sortOrder: 'asc' } },
        tontraeger: { orderBy: { sortOrder: 'asc' } },
        voiceSections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            videos: { orderBy: { sortOrder: 'asc' } },
            sheets: { orderBy: { sortOrder: 'asc' } },
            audioSamples: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    }),
    db.instrument.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.teacher.findMany({ orderBy: { name: 'asc' } }),
    loadTagSuggestions(),
  ])
  if (!piece) notFound()

  return (
    <div>
      <PageHeader
        title={piece.title}
        subtitle={`${piece.artist || '—'} · ${piece.instrumentName || 'kein Instrument'} ${piece.published ? '· Live' : '· Entwurf'}`}
        back={{ href: '/admin/lernvideos', label: 'Lernvideo-Datenbank' }}
      />

      <PieceForm
        piece={piece}
        instruments={instruments}
        teachers={teachers}
        stilSuggestions={suggestions.stil}
        genreSuggestions={suggestions.genre}
        taktSuggestions={suggestions.taktart}
        autoSuggestions={suggestions.auto}
      />

      {/* ── Noten / PDFs am Stück ── */}
      <section className="mt-10 max-w-3xl">
        <h2 className="font-heading font-bold text-xl mb-1">Noten & PDFs (allgemein)</h2>
        <p className="font-sans text-sm text-text-secondary mb-4">
          Notenausgaben des ganzen Stücks. Stimmen-spezifische Noten verwaltest du weiter unten je Stimme.
        </p>
        <RepeatableList
          items={piece.sheets.map((s) => ({
            id: s.id,
            primary: s.label,
            secondary: `${s.sheetKey || '—'} · CHF ${s.price}`,
            link: s.pdfUrl,
          }))}
          addAction={addPieceSheet}
          deleteAction={deleteSheet}
          hiddenFields={{ pieceId: piece.id }}
          fields={[
            { name: 'label', label: 'Bezeichnung', required: true, placeholder: 'z.B. Violinschlüssel' },
            { name: 'sheetKey', label: 'Key', placeholder: 'violin / griff / laemu' },
            { name: 'price', label: 'Preis', type: 'number' },
            { name: 'pdfUrl', label: 'PDF', upload: true, accept: 'application/pdf' },
          ]}
        />
      </section>

      {/* ── Stimmen ── */}
      <section className="mt-10">
        <h2 className="font-heading font-bold text-xl mb-1">Stimmen</h2>
        <p className="font-sans text-sm text-text-secondary mb-4">
          1. Stimme, 2. Stimme, Begleitungen … je mit eigenen Lernvideos, Noten und Audios.
        </p>
        <VoiceSectionsManager pieceId={piece.id} sections={piece.voiceSections} />
      </section>

      {/* ── Mixer ── */}
      <section className="mt-10 max-w-3xl">
        <h2 className="font-heading font-bold text-xl mb-1">Mixer-Musiker</h2>
        <p className="font-sans text-sm text-text-secondary mb-4">
          Spuren des Master-Mixers (Stimme, Instrument, Standard-Lautstärke).
        </p>
        <RepeatableList
          items={piece.mixerMusicians.map((m) => ({
            id: m.id,
            primary: `${m.voice || m.name} — ${m.instrument}`,
            secondary: `${m.name} · Vol ${m.volume}`,
            color: m.color,
          }))}
          addAction={addMixerMusician}
          deleteAction={deleteMixerMusician}
          hiddenFields={{ pieceId: piece.id }}
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'voice', label: 'Stimme', placeholder: '1. Stimme' },
            { name: 'instrument', label: 'Instrument' },
            { name: 'singing', label: 'Gesang' },
            { name: 'volume', label: 'Vol', type: 'number' },
            { name: 'color', label: 'Farbe', type: 'color' },
          ]}
        />
      </section>

      {/* ── Originalaufnahmen ── */}
      <section className="mt-10 max-w-3xl">
        <h2 className="font-heading font-bold text-xl mb-1">Originalaufnahmen</h2>
        <RepeatableList
          items={piece.originalRecordings.map((r) => ({
            id: r.id,
            primary: r.label,
            secondary: `${r.type} · ${r.artist}`,
            link: r.url,
          }))}
          addAction={addOriginalRecording}
          deleteAction={deleteOriginalRecording}
          hiddenFields={{ pieceId: piece.id }}
          fields={[
            { name: 'label', label: 'Bezeichnung', required: true },
            { name: 'artist', label: 'Interpret' },
            { name: 'type', label: 'Typ', type: 'select', options: ['audio', 'youtube'] },
            { name: 'url', label: 'URL', upload: true, accept: 'audio/*' },
          ]}
        />
      </section>

      {/* ── Tonträger ── */}
      <section className="mt-10 max-w-3xl">
        <h2 className="font-heading font-bold text-xl mb-1">Tonträger</h2>
        <RepeatableList
          items={piece.tontraeger.map((t) => ({
            id: t.id,
            primary: t.label,
            secondary: `${t.year ?? ''} · ${t.artist}`,
            link: t.url,
          }))}
          addAction={addTontraeger}
          deleteAction={deleteTontraeger}
          hiddenFields={{ pieceId: piece.id }}
          fields={[
            { name: 'label', label: 'Album / Titel', required: true },
            { name: 'artist', label: 'Interpret' },
            { name: 'year', label: 'Jahr', type: 'number' },
            { name: 'url', label: 'Link' },
          ]}
        />
      </section>

      {/* ── Löschen ── */}
      <form action={deletePiece} className="mt-12 max-w-3xl border-t border-border pt-6">
        <input type="hidden" name="id" value={piece.id} />
        <ConfirmSubmit message="Stück inkl. aller Stimmen, Noten und Medien-Verknüpfungen löschen?">
          Stück löschen
        </ConfirmSubmit>
      </form>
    </div>
  )
}
