'use client'

import { useFormState } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { loginAction } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'

function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined)
  const params = useSearchParams()
  const next = params.get('next') ?? '/admin'

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-serif text-4xl font-bold text-dark">LAEMU</span>
          <p className="font-sans text-sm text-text-secondary mt-2 italic">Team-Backend</p>
        </div>

        <div className="bg-white border border-border p-8">
          <h1 className="font-heading text-2xl font-extrabold text-dark mb-1">Team-Anmeldung</h1>
          <p className="font-sans text-sm text-text-secondary mb-6">
            Inhaltsverwaltung der LAEMU-Mitglieder-App.
          </p>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="field-label">E-Mail</label>
              <input type="email" name="email" required autoComplete="email" className="field-input" />
            </div>
            <div>
              <label className="field-label">Passwort</label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="field-input"
              />
            </div>

            {state?.error && (
              <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                {state.error}
              </p>
            )}

            <SubmitButton className="w-full" pendingLabel="Wird angemeldet…">
              Anmelden →
            </SubmitButton>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="font-sans text-sm text-text-secondary">
              Noch kein Login?{' '}
              <Link
                href="/register"
                className="text-dark font-semibold hover:text-accent-gold transition-colors"
              >
                Team-Konto erstellen →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center font-sans text-xs text-text-secondary mt-6">
          Zugang nur für das LAEMU-Team. Bei Problemen an einen Admin wenden.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
