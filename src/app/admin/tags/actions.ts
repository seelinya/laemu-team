'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/auth'
import { TAG_CATEGORIES } from '@/lib/constants'

export async function addTag(formData: FormData) {
  await requireSession()
  const category = String(formData.get('category') || '')
  const value = String(formData.get('value') || '').trim()
  if (!value || !TAG_CATEGORIES.includes(category as (typeof TAG_CATEGORIES)[number])) return

  await db.tag.upsert({
    where: { category_value: { category, value } },
    update: {},
    create: { category, value },
  })
  revalidatePath('/admin/tags')
}

export async function deleteTag(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  if (id) await db.tag.delete({ where: { id } })
  revalidatePath('/admin/tags')
}
