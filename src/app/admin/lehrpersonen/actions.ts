'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/auth'

export async function saveTeacher(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  const data = {
    name: String(formData.get('name') || '').trim(),
    handle: String(formData.get('handle') || '').trim(),
    instrument: String(formData.get('instrument') || '').trim(),
    bio: String(formData.get('bio') || '').trim(),
    imageUrl: String(formData.get('imageUrl') || '').trim(),
    sortOrder: Number(formData.get('sortOrder') || 0),
  }
  if (!data.name) return

  if (id) await db.teacher.update({ where: { id }, data })
  else await db.teacher.create({ data })

  revalidatePath('/admin/lehrpersonen')
  redirect('/admin/lehrpersonen')
}

export async function deleteTeacher(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  if (id) await db.teacher.delete({ where: { id } })
  revalidatePath('/admin/lehrpersonen')
  redirect('/admin/lehrpersonen')
}
