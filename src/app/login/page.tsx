import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { authBypassEnabled, authDisabled } from '@/lib/secret'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  // Login deaktiviert → keine Anmeldung nötig, direkt zu den Inhalten.
  if (authDisabled()) redirect('/admin')

  const bypass = authBypassEnabled()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-serif text-4xl font-bold text-dark">LAEMU</span>
          <p className="font-sans text-sm text-text-secondary mt-2 italic">Team-Backend</p>
        </div>

        <Suspense>
          <LoginForm bypass={bypass} />
        </Suspense>

        <p className="text-center font-sans text-xs text-text-secondary mt-6">
          Zugang nur für das LAEMU-Team. Bei Problemen an einen Admin wenden.
        </p>
      </div>
    </div>
  )
}
