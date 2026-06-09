'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { slugify } from '@/lib/slug'

// ─── Kurs ─────────────────────────────────────────────────────────────────────

export async function saveCourse(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  const instrumentId = String(formData.get('instrumentId') || '')
  const data = {
    title,
    slug: slugify(String(formData.get('slug') || '') || title),
    description: String(formData.get('description') || '').trim(),
    track: String(formData.get('track') || 'starter'),
    level: String(formData.get('level') || 'Starter'),
    emoji: String(formData.get('emoji') || '🎵').trim() || '🎵',
    imageUrl: String(formData.get('imageUrl') || '').trim(),
    durationLabel: String(formData.get('durationLabel') || '').trim(),
    teacherName: String(formData.get('teacherName') || '').trim(),
    sortOrder: Number(formData.get('sortOrder') || 0),
    published: formData.get('published') === 'on',
    instrumentId: instrumentId || null,
  }
  if (!title) return

  if (id) {
    await db.course.update({ where: { id }, data })
    revalidatePath(`/admin/kurse/${id}`)
    revalidatePath('/admin/kurse')
    redirect(`/admin/kurse/${id}`)
  } else {
    const created = await db.course.create({ data })
    revalidatePath('/admin/kurse')
    redirect(`/admin/kurse/${created.id}`)
  }
}

export async function deleteCourse(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  if (id) await db.course.delete({ where: { id } })
  revalidatePath('/admin/kurse')
  redirect('/admin/kurse')
}

// ─── Modul ──────────────────────────────────────────────────────────────────

export async function createModule(formData: FormData) {
  await requireSession()
  const courseId = String(formData.get('courseId') || '')
  const title = String(formData.get('title') || '').trim()
  if (!courseId || !title) return
  const count = await db.module.count({ where: { courseId } })
  await db.module.create({ data: { courseId, title, sortOrder: count } })
  revalidatePath(`/admin/kurse/${courseId}`)
}

export async function updateModule(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const courseId = String(formData.get('courseId') || '')
  if (!id) return
  await db.module.update({
    where: { id },
    data: {
      title: String(formData.get('title') || '').trim(),
      status: String(formData.get('status') || 'not-started'),
      sortOrder: Number(formData.get('sortOrder') || 0),
    },
  })
  revalidatePath(`/admin/kurse/${courseId}`)
}

export async function deleteModule(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const courseId = String(formData.get('courseId') || '')
  if (id) await db.module.delete({ where: { id } })
  revalidatePath(`/admin/kurse/${courseId}`)
}

// ─── Lektion ──────────────────────────────────────────────────────────────────

export async function createLesson(formData: FormData) {
  await requireSession()
  const moduleId = String(formData.get('moduleId') || '')
  const courseId = String(formData.get('courseId') || '')
  const title = String(formData.get('title') || '').trim()
  if (!moduleId || !title) return
  const count = await db.lesson.count({ where: { moduleId } })
  const created = await db.lesson.create({ data: { moduleId, title, sortOrder: count } })
  revalidatePath(`/admin/kurse/${courseId}`)
  redirect(`/admin/kurse/${courseId}/lektion/${created.id}`)
}

export async function saveLesson(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const courseId = String(formData.get('courseId') || '')
  if (!id) return
  await db.lesson.update({
    where: { id },
    data: {
      title: String(formData.get('title') || '').trim(),
      durationLabel: String(formData.get('durationLabel') || '').trim(),
      type: String(formData.get('type') || 'video'),
      videoUrl: String(formData.get('videoUrl') || '').trim(),
      textContent: String(formData.get('textContent') || '').trim(),
      pdfUrl: String(formData.get('pdfUrl') || '').trim(),
      sortOrder: Number(formData.get('sortOrder') || 0),
      published: formData.get('published') === 'on',
    },
  })
  revalidatePath(`/admin/kurse/${courseId}`)
  redirect(`/admin/kurse/${courseId}`)
}

export async function deleteLesson(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const courseId = String(formData.get('courseId') || '')
  if (id) await db.lesson.delete({ where: { id } })
  revalidatePath(`/admin/kurse/${courseId}`)
  redirect(`/admin/kurse/${courseId}`)
}
