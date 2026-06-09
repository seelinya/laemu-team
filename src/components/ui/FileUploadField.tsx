'use client'

import { useRef, useState } from 'react'

// Upload-Feld: lädt eine Datei nach /api/upload hoch und schreibt die
// resultierende URL in ein (sichtbares) Textfeld. So lassen sich Bilder,
// Videos und PDFs hochladen ODER alternativ eine externe URL eintragen.
export function FileUploadField({
  name,
  label,
  initial = '',
  accept,
  hint,
}: {
  name: string
  label: string
  initial?: string
  accept?: string
  hint?: string
}) {
  const [url, setUrl] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const isImage = /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url)

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload fehlgeschlagen')
      setUrl(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL oder Datei hochladen…"
          className="field-input flex-1"
        />
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-secondary whitespace-nowrap"
        >
          {uploading ? 'Lädt…' : '⬆ Hochladen'}
        </button>
      </div>
      {hint && <p className="font-sans text-[11px] text-text-secondary mt-1">{hint}</p>}
      {error && <p className="font-sans text-[11px] text-red-600 mt-1">{error}</p>}
      {url && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Vorschau" className="mt-2 h-20 w-auto border border-border object-cover" />
      )}
    </div>
  )
}
