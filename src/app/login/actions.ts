'use server'

import { redirect } from 'next/navigation'
import { login } from '@/lib/auth'

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/admin')

  if (!email || !password) {
    return { error: 'Bitte E-Mail und Passwort eingeben.' }
  }

  const result = await login(email, password)
  if (!result.ok) {
    return { error: result.error ?? 'Anmeldung fehlgeschlagen.' }
  }

  redirect(next.startsWith('/admin') ? next : '/admin')
}
