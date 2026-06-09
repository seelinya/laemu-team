'use server'

import { redirect } from 'next/navigation'
import { register } from '@/lib/auth'

export async function registerAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const passwordConfirm = String(formData.get('passwordConfirm') || '')
  const code = String(formData.get('code') || '')

  if (password !== passwordConfirm) {
    return { error: 'Die Passwörter stimmen nicht überein.' }
  }

  const result = await register({ name, email, password, code })
  if (!result.ok) {
    return { error: result.error ?? 'Registrierung fehlgeschlagen.' }
  }

  redirect('/admin')
}
