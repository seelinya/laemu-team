'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/auth'

export async function saveWish(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  const composer = String(formData.get('composer') || '').trim()
  const status = String(formData.get('status') || 'offen')
  const available = String(formData.get('available') || '[]')

  if (!title) return

  if (id) {
    await db.wish.update({ where: { id }, data: { title, composer, status, available } })
  } else {
    await db.wish.create({ data: { title, composer, status, available } })
  }
  revalidatePath('/admin/wuensche')
}

export async function deleteWish(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  if (id) await db.wish.delete({ where: { id } })
  revalidatePath('/admin/wuensche')
}
