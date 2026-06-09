'use server'

import { revalidatePath } from 'next/cache'
import { unlink } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/auth'

export async function deleteMedia(formData: FormData) {
  await requireSession()
  const id = String(formData.get('id') || '')
  if (!id) return
  const asset = await db.mediaAsset.findUnique({ where: { id } })
  if (asset) {
    // Datei von der Platte entfernen (Fehler ignorieren, falls schon weg).
    try {
      await unlink(path.join(process.cwd(), 'public', 'uploads', asset.filename))
    } catch {
      /* ignore */
    }
    await db.mediaAsset.delete({ where: { id } })
  }
  revalidatePath('/admin/medien')
}
