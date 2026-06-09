'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export async function saveInstrument(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const label = String(formData.get('label') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const data = {
    label,
    slug: slugInput ? slugify(slugInput) : slugify(label),
    emoji: String(formData.get('emoji') || '🎵').trim() || '🎵',
    description: String(formData.get('description') || '').trim(),
    sortOrder: Number(formData.get('sortOrder') || 0),
  }
  if (!data.label || !data.slug) return

  if (id) {
    await db.instrument.update({ where: { id }, data })
  } else {
    await db.instrument.create({ data })
  }
  revalidatePath('/admin/instrumente')
  redirect('/admin/instrumente')
}

export async function deleteInstrument(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  if (id) await db.instrument.delete({ where: { id } })
  revalidatePath('/admin/instrumente')
  redirect('/admin/instrumente')
}
