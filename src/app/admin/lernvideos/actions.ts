'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { slugify } from '@/lib/slug'

function num(formData: FormData, key: string): number | null {
  const v = formData.get(key)
  if (v === null || String(v).trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function intOr(formData: FormData, key: string, fallback: number): number {
  return num(formData, key) ?? fallback
}

function pieceRevalidate(id: string) {
  revalidatePath('/admin/lernvideos')
  revalidatePath(`/admin/lernvideos/${id}`)
}

// ─── Stück (Piece) ────────────────────────────────────────────────────────────

export async function savePiece(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  if (!title) return

  const instrumentId = String(formData.get('instrumentId') || '') || null
  let instrumentName = ''
  if (instrumentId) {
    const inst = await db.instrument.findUnique({ where: { id: instrumentId } })
    instrumentName = inst?.label ?? ''
  }

  const teacherIds = formData.getAll('teacherIds').map(String).filter(Boolean)

  const data = {
    title,
    slug: slugify(String(formData.get('slug') || '') || title),
    artist: String(formData.get('artist') || '').trim(),
    composer: String(formData.get('composer') || '').trim(),
    year: num(formData, 'year'),
    formation: String(formData.get('formation') || '').trim(),
    artDesStueckes: String(formData.get('artDesStueckes') || 'volkstuemlich'),
    taktart: String(formData.get('taktart') || '').trim(),
    plan: String(formData.get('plan') || 'free'),
    difficultyNum: intOr(formData, 'difficultyNum', 1),
    level: intOr(formData, 'level', 1),
    stufen: intOr(formData, 'stufen', 1),
    meter: String(formData.get('meter') || '').trim(),
    intro: String(formData.get('intro') || '').trim(),
    lyrics: String(formData.get('lyrics') || '').trim(),
    spotifyUrl: String(formData.get('spotifyUrl') || '').trim(),
    imageUrl: String(formData.get('imageUrl') || '').trim(),
    masterVideoUrl: String(formData.get('masterVideoUrl') || '').trim(),
    hasMixer: formData.get('hasMixer') === 'on',
    hasViolin: formData.get('hasViolin') === 'on',
    hasGriff: formData.get('hasGriff') === 'on',
    price: intOr(formData, 'price', 0),
    published: formData.get('published') === 'on',
    styleTags: String(formData.get('styleTags') || '[]'),
    melodieTags: String(formData.get('melodieTags') || '[]'),
    autoTags: String(formData.get('autoTags') || '[]'),
    formations: String(formData.get('formations') || '[]'),
    instrumentId,
    instrumentName,
  }

  const teacherRefs = teacherIds.map((tid) => ({ id: tid }))

  if (id) {
    await db.piece.update({
      where: { id },
      data: { ...data, teachers: { set: teacherRefs } },
    })
    pieceRevalidate(id)
    redirect(`/admin/lernvideos/${id}`)
  } else {
    const created = await db.piece.create({
      data: { ...data, teachers: { connect: teacherRefs } },
    })
    revalidatePath('/admin/lernvideos')
    redirect(`/admin/lernvideos/${created.id}`)
  }
}

export async function deletePiece(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  if (id) await db.piece.delete({ where: { id } })
  revalidatePath('/admin/lernvideos')
  redirect('/admin/lernvideos')
}

// ─── Piece-Sheets (Noten am Stück) ──────────────────────────────────────────

export async function addPieceSheet(formData: FormData) {
  await requireSession()
  const pieceId = String(formData.get('pieceId') || '')
  const label = String(formData.get('label') || '').trim()
  if (!pieceId || !label) return
  const count = await db.sheet.count({ where: { pieceId } })
  await db.sheet.create({
    data: {
      pieceId,
      label,
      sheetKey: String(formData.get('sheetKey') || '').trim(),
      price: intOr(formData, 'price', 0),
      pdfUrl: String(formData.get('pdfUrl') || '').trim(),
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

export async function deleteSheet(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (id) await db.sheet.delete({ where: { id } })
  pieceRevalidate(pieceId)
}

// ─── Stimmen-Abschnitte (VoiceSection) ──────────────────────────────────────

export async function addVoiceSection(formData: FormData) {
  await requireSession()
  const pieceId = String(formData.get('pieceId') || '')
  const label = String(formData.get('label') || '').trim()
  if (!pieceId || !label) return
  const count = await db.voiceSection.count({ where: { pieceId } })
  await db.voiceSection.create({
    data: {
      pieceId,
      label,
      instrument: String(formData.get('instrument') || '').trim(),
      color: String(formData.get('color') || '#C4973A'),
      hasLaemuPlayer: formData.get('hasLaemuPlayer') === 'on',
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

export async function updateVoiceSection(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (!id) return
  await db.voiceSection.update({
    where: { id },
    data: {
      label: String(formData.get('label') || '').trim(),
      instrument: String(formData.get('instrument') || '').trim(),
      color: String(formData.get('color') || '#C4973A'),
      hasLaemuPlayer: formData.get('hasLaemuPlayer') === 'on',
      sortOrder: intOr(formData, 'sortOrder', 0),
    },
  })
  pieceRevalidate(pieceId)
}

export async function deleteVoiceSection(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (id) await db.voiceSection.delete({ where: { id } })
  pieceRevalidate(pieceId)
}

// ─── Stimmen-Lernvideos ───────────────────────────────────────────────────────

export async function addVoiceVideo(formData: FormData) {
  await requireSession()
  const sectionId = String(formData.get('sectionId') || '')
  const pieceId = String(formData.get('pieceId') || '')
  const label = String(formData.get('label') || '').trim()
  if (!sectionId || !label) return
  const count = await db.voiceVideo.count({ where: { sectionId } })
  await db.voiceVideo.create({
    data: {
      sectionId,
      label,
      durationLabel: String(formData.get('durationLabel') || '').trim(),
      videoUrl: String(formData.get('videoUrl') || '').trim(),
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

export async function deleteVoiceVideo(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (id) await db.voiceVideo.delete({ where: { id } })
  pieceRevalidate(pieceId)
}

// ─── Stimmen-Noten ──────────────────────────────────────────────────────────

export async function addSectionSheet(formData: FormData) {
  await requireSession()
  const sectionId = String(formData.get('sectionId') || '')
  const pieceId = String(formData.get('pieceId') || '')
  const label = String(formData.get('label') || '').trim()
  if (!sectionId || !label) return
  const count = await db.sheet.count({ where: { sectionId } })
  await db.sheet.create({
    data: {
      sectionId,
      label,
      sheetKey: String(formData.get('sheetKey') || '').trim(),
      price: intOr(formData, 'price', 0),
      pdfUrl: String(formData.get('pdfUrl') || '').trim(),
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

// ─── Stimmen-Audios ───────────────────────────────────────────────────────────

export async function addAudioSample(formData: FormData) {
  await requireSession()
  const sectionId = String(formData.get('sectionId') || '')
  const pieceId = String(formData.get('pieceId') || '')
  const label = String(formData.get('label') || '').trim()
  if (!sectionId || !label) return
  const count = await db.audioSample.count({ where: { sectionId } })
  await db.audioSample.create({
    data: {
      sectionId,
      label,
      durationLabel: String(formData.get('durationLabel') || '').trim(),
      type: String(formData.get('type') || 'audio'),
      url: String(formData.get('url') || '').trim(),
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

export async function deleteAudioSample(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (id) await db.audioSample.delete({ where: { id } })
  pieceRevalidate(pieceId)
}

// ─── Mixer-Musiker ────────────────────────────────────────────────────────────

export async function addMixerMusician(formData: FormData) {
  await requireSession()
  const pieceId = String(formData.get('pieceId') || '')
  const name = String(formData.get('name') || '').trim()
  if (!pieceId || !name) return
  const count = await db.mixerMusician.count({ where: { pieceId } })
  await db.mixerMusician.create({
    data: {
      pieceId,
      name,
      voice: String(formData.get('voice') || '').trim(),
      instrument: String(formData.get('instrument') || '').trim(),
      singing: String(formData.get('singing') || '').trim(),
      volume: intOr(formData, 'volume', 80),
      color: String(formData.get('color') || '#C4973A'),
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

export async function deleteMixerMusician(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (id) await db.mixerMusician.delete({ where: { id } })
  pieceRevalidate(pieceId)
}

// ─── Originalaufnahmen ────────────────────────────────────────────────────────

export async function addOriginalRecording(formData: FormData) {
  await requireSession()
  const pieceId = String(formData.get('pieceId') || '')
  const label = String(formData.get('label') || '').trim()
  if (!pieceId || !label) return
  const count = await db.originalRecording.count({ where: { pieceId } })
  await db.originalRecording.create({
    data: {
      pieceId,
      label,
      type: String(formData.get('type') || 'audio'),
      artist: String(formData.get('artist') || '').trim(),
      url: String(formData.get('url') || '').trim(),
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

export async function deleteOriginalRecording(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (id) await db.originalRecording.delete({ where: { id } })
  pieceRevalidate(pieceId)
}

// ─── Tonträger ──────────────────────────────────────────────────────────────

export async function addTontraeger(formData: FormData) {
  await requireSession()
  const pieceId = String(formData.get('pieceId') || '')
  const label = String(formData.get('label') || '').trim()
  if (!pieceId || !label) return
  const count = await db.tontraeger.count({ where: { pieceId } })
  await db.tontraeger.create({
    data: {
      pieceId,
      label,
      year: num(formData, 'year'),
      artist: String(formData.get('artist') || '').trim(),
      url: String(formData.get('url') || '').trim(),
      sortOrder: count,
    },
  })
  pieceRevalidate(pieceId)
}

export async function deleteTontraeger(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const pieceId = String(formData.get('pieceId') || '')
  if (id) await db.tontraeger.delete({ where: { id } })
  pieceRevalidate(pieceId)
}
