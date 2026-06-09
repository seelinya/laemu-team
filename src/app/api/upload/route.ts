import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function kindFromMime(mime: string): string {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime === 'application/pdf') return 'pdf'
  return 'other'
}

function safeSlug(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace(/[^a-z0-9.]/g, '')
  const base = path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `${base || 'datei'}-${randomBytes(4).toString('hex')}${ext}`
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Keine Datei erhalten.' }, { status: 400 })
  }

  const maxBytes = 200 * 1024 * 1024 // 200 MB
  if (file.size > maxBytes) {
    return NextResponse.json({ error: 'Datei ist zu groß (max. 200 MB).' }, { status: 413 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = safeSlug(file.name || 'upload')

  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(path.join(UPLOAD_DIR, filename), buffer)

  const url = `/uploads/${filename}`
  const asset = await db.mediaAsset.create({
    data: {
      filename,
      originalName: file.name || filename,
      url,
      mimeType: file.type || '',
      kind: kindFromMime(file.type || ''),
      size: file.size,
    },
  })

  return NextResponse.json({ url, id: asset.id, kind: asset.kind })
}
