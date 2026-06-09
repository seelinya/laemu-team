import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { PageHeader } from '@/components/admin/PageHeader'
import { TEAM_ROLES, TEAM_ROLE_LABELS } from '@/lib/constants'
import { createTeamUser, updateTeamUser, deleteTeamUser } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { ConfirmSubmit } from '@/components/ui/ConfirmSubmit'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const session = await getSession()
  const isAdmin = session?.role === 'admin'
  const users = await db.teamUser.findMany({ orderBy: { createdAt: 'asc' } })

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Team" />
        <p className="font-sans text-sm text-text-secondary">
          Die Team-Verwaltung ist nur für Admins zugänglich.
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Team-Mitglieder verwalten. Rollen: Admin (alles inkl. Team), Redaktion & Lehrperson (Inhalte)."
      />

      <div className="card p-6 mb-8 max-w-2xl">
        <h2 className="font-heading font-bold text-base mb-4">Neues Team-Mitglied</h2>
        <form action={createTeamUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Name *</label>
            <input name="name" required className="field-input" />
          </div>
          <div>
            <label className="field-label">E-Mail *</label>
            <input type="email" name="email" required className="field-input" />
          </div>
          <div>
            <label className="field-label">Rolle</label>
            <select name="role" defaultValue="editor" className="field-input">
              {TEAM_ROLES.map((r) => (
                <option key={r} value={r}>
                  {TEAM_ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Passwort * (min. 6 Zeichen)</label>
            <input type="text" name="password" required minLength={6} className="field-input" />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton>Mitglied anlegen</SubmitButton>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="card p-4">
            <form action={updateTeamUser}>
            <input type="hidden" name="id" value={u.id} />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_140px_1fr_auto] gap-3 items-end">
              <div>
                <label className="field-label">Name</label>
                <input name="name" defaultValue={u.name} className="field-input" />
              </div>
              <div>
                <label className="field-label">E-Mail</label>
                <input value={u.email} disabled className="field-input bg-background text-text-secondary" />
              </div>
              <div>
                <label className="field-label">Rolle</label>
                <select name="role" defaultValue={u.role} className="field-input">
                  {TEAM_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {TEAM_ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Neues Passwort</label>
                <input type="text" name="password" placeholder="leer = unverändert" className="field-input" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 font-sans text-xs">
                  <input type="checkbox" name="active" defaultChecked={u.active} /> aktiv
                </label>
                <SubmitButton variant="secondary">Speichern</SubmitButton>
              </div>
            </div>
            </form>
            {u.id !== session?.sub && (
              <form action={deleteTeamUser} className="mt-3 pt-3 border-t border-border">
                <input type="hidden" name="id" value={u.id} />
                <ConfirmSubmit
                  message={`Team-Mitglied ${u.name} löschen?`}
                  className="font-sans text-xs text-red-600 hover:underline"
                >
                  Mitglied löschen
                </ConfirmSubmit>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
