'use client'

import { useFormState } from 'react-dom'
import { registerAction } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'

export function RegisterForm({ requireCode }: { requireCode: boolean }) {
  const [state, formAction] = useFormState(registerAction, undefined)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="field-label">Name</label>
        <input name="name" required autoComplete="name" className="field-input" />
      </div>
      <div>
        <label className="field-label">E-Mail</label>
        <input type="email" name="email" required autoComplete="email" className="field-input" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Passwort</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Passwort wiederholen</label>
          <input
            type="password"
            name="passwordConfirm"
            required
            minLength={6}
            autoComplete="new-password"
            className="field-input"
          />
        </div>
      </div>

      {requireCode && (
        <div>
          <label className="field-label">Team-Code</label>
          <input name="code" required className="field-input" placeholder="Vom Team erhalten" />
          <p className="font-sans text-[11px] text-text-secondary mt-1">
            Den Team-Code erhältst du von einem bestehenden Team-Mitglied.
          </p>
        </div>
      )}

      {state?.error && (
        <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton className="w-full" pendingLabel="Konto wird erstellt…">
        Konto erstellen →
      </SubmitButton>
    </form>
  )
}
