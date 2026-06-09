'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin, hashPassword } from '@/lib/auth'
import { TEAM_ROLES } from '@/lib/constants'

export async function createTeamUser(formData: FormData) {
  await requireAdmin()
  const email = String(formData.get('email') || '').toLowerCase().trim()
  const name = String(formData.get('name') || '').trim()
  const role = String(formData.get('role') || 'editor')
  const password = String(formData.get('password') || '')

  if (!email || !name || password.length < 6) {
    return
  }
  if (!TEAM_ROLES.includes(role as (typeof TEAM_ROLES)[number])) return

  const existing = await db.teamUser.findUnique({ where: { email } })
  if (existing) return

  await db.teamUser.create({
    data: { email, name, role, passwordHash: await hashPassword(password) },
  })
  revalidatePath('/admin/team')
}

export async function updateTeamUser(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const role = String(formData.get('role') || 'editor')
  const active = formData.get('active') === 'on'
  const newPassword = String(formData.get('password') || '')

  if (!id || !name) return

  const data: { name: string; role: string; active: boolean; passwordHash?: string } = {
    name,
    role,
    active,
  }
  if (newPassword && newPassword.length >= 6) {
    data.passwordHash = await hashPassword(newPassword)
  }
  await db.teamUser.update({ where: { id }, data })
  revalidatePath('/admin/team')
}

export async function deleteTeamUser(formData: FormData) {
  const me = await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id || id === me.sub) return // sich selbst nicht löschen
  await db.teamUser.delete({ where: { id } })
  revalidatePath('/admin/team')
}
