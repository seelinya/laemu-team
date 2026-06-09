import Link from 'next/link'
import { db } from '@/lib/db'
import { RegisterForm } from './RegisterForm'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const userCount = await db.teamUser.count()
  const isBootstrap = userCount === 0
  const codeConfigured = Boolean(process.env.TEAM_REGISTRATION_CODE)
  // Selbst-Registrierung ist offen, wenn es entweder der erste Account ist
  // (Bootstrap) oder ein Team-Code konfiguriert wurde.
  const open = isBootstrap || codeConfigured

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-serif text-4xl font-bold text-dark">LAEMU</span>
          <p className="font-sans text-sm text-text-secondary mt-2 italic">Team-Backend</p>
        </div>

        <div className="bg-white border border-border p-8">
          <h1 className="font-heading text-2xl font-extrabold text-dark mb-1">
            {isBootstrap ? 'Erstes Team-Konto anlegen' : 'Team-Konto erstellen'}
          </h1>
          <p className="font-sans text-sm text-text-secondary mb-6">
            {isBootstrap
              ? 'Es existiert noch kein Konto — dieses erste Konto wird automatisch zum Admin.'
              : 'Registriere dich mit dem Team-Code, um Zugang zur Inhaltsverwaltung zu erhalten.'}
          </p>

          {open ? (
            <RegisterForm requireCode={!isBootstrap} />
          ) : (
            <p className="font-sans text-sm text-text-secondary bg-background border border-border px-4 py-3">
              Die Selbst-Registrierung ist aktuell deaktiviert. Bitte wende dich an einen
              Admin, der dir unter <strong>Team</strong> einen Zugang anlegt.
            </p>
          )}
        </div>

        <p className="text-center font-sans text-sm text-text-secondary mt-6">
          Schon ein Konto?{' '}
          <Link href="/login" className="text-dark font-semibold hover:text-accent-gold transition-colors">
            Jetzt anmelden →
          </Link>
        </p>
      </div>
    </div>
  )
}
