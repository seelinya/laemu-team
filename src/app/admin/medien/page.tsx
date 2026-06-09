import { db } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { MediaUploader } from '@/components/admin/MediaUploader'
import { CopyButton } from '@/components/ui/CopyButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'
import { deleteMedia } from './actions'

export const dynamic = 'force-dynamic'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const KIND_ICON: Record<string, string> = {
  image: '🖼️', video: '🎬', pdf: '📄', audio: '🎵', other: '📦',
}

export default async function MedienPage() {
  const assets = await db.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <PageHeader
        title="Medien"
        subtitle="Hochgeladene Bilder, Videos, Audios und PDFs. Die URL kann in Lektionen, Lernvideos und Noten verlinkt werden."
        action={<MediaUploader />}
      />

      {assets.length === 0 && (
        <p className="font-sans text-sm text-text-secondary">
          Noch keine Medien. Lade oben Dateien hoch oder nutze die Upload-Felder in den Formularen.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {assets.map((a) => (
          <div key={a.id} className="card overflow-hidden flex flex-col">
            <div className="aspect-video bg-background flex items-center justify-center overflow-hidden">
              {a.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt={a.originalName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{KIND_ICON[a.kind] ?? '📦'}</span>
              )}
            </div>
            <div className="p-3 flex-1 flex flex-col gap-1">
              <p className="font-sans text-xs font-medium truncate" title={a.originalName}>
                {a.originalName}
              </p>
              <p className="font-sans text-[11px] text-text-secondary">
                {a.kind} · {formatSize(a.size)}
              </p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <CopyButton text={a.url} />
                <form action={deleteMedia}>
                  <input type="hidden" name="id" value={a.id} />
                  <ConfirmSubmit
                    message="Datei löschen? Verlinkungen werden dadurch ungültig."
                    className="font-sans text-[11px] text-red-600 hover:underline"
                  >
                    Löschen
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
