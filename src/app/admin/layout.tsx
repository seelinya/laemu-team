import { requireSession } from '@/lib/auth'
import { ensureDbReady } from '@/lib/ensureDb'
import { Sidebar } from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Stellt sicher, dass die Datenbank eingerichtet & befüllt ist (einmalig).
  await ensureDbReady()
  const session = await requireSession()

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar user={{ name: session.name, email: session.email, role: session.role }} />
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 sm:py-8 max-w-6xl">{children}</main>
    </div>
  )
}
