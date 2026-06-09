'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// Direkt-Uploader für die Medienbibliothek: lädt eine oder mehrere Dateien hoch
// und aktualisiert die Liste.
export function MediaUploader() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFiles(files: FileList) {
    setUploading(true)
    setError('')
    try {
      for (const file of Array.from(files)) {
        const body = new FormData()
        body.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || `Upload fehlgeschlagen: ${file.name}`)
        }
      }
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files)
        }}
      />
      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary">
        {uploading ? 'Lädt hoch…' : '⬆ Dateien hochladen'}
      </button>
      {error && <p className="font-sans text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}
