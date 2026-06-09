'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const NAV: { href: string; label: string; icon: string }[] = [
  { href: '/admin', label: 'Übersicht', icon: '◧' },
  { href: '/admin/instrumente', label: 'Instrumente', icon: '🎵' },
  { href: '/admin/kurse', label: 'Lehrgänge & Kurse', icon: '🎓' },
  { href: '/admin/lernvideos', label: 'Lernvideo-Datenbank', icon: '📹' },
  { href: '/admin/tags', label: 'Tags', icon: '🏷️' },
  { href: '/admin/lehrpersonen', label: 'Lehrpersonen', icon: '🧑‍🏫' },
  { href: '/admin/wuensche', label: 'Stückwünsche', icon: '⭐' },
  { href: '/admin/medien', label: 'Medien', icon: '🖼️' },
  { href: '/admin/team', label: 'Team', icon: '👥' },
]

export function Sidebar({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname()

  return (
    <aside className="w-full lg:w-60 lg:min-h-screen bg-dark text-white flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="font-serif text-2xl font-bold">
          LAEMU
        </Link>
        <p className="font-sans text-[11px] text-white/40 uppercase tracking-widest mt-0.5">
          Team-Backend
        </p>
      </div>

      <nav className="flex-1 px-2 py-3 flex flex-row lg:flex-col gap-0.5 overflow-x-auto">
        {NAV.map((item) => {
          const active =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2.5 font-sans text-sm transition-colors whitespace-nowrap',
                active ? 'bg-accent-gold text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="font-sans text-sm text-white truncate">{user.name}</p>
        <p className="font-sans text-[11px] text-white/40 truncate">{user.email}</p>
        <p className="font-sans text-[10px] text-accent-gold uppercase tracking-widest mt-0.5">
          {user.role}
        </p>
        <form action="/logout" method="post" className="mt-3">
          <button
            type="submit"
            className="w-full text-left font-sans text-xs text-white/50 hover:text-white transition-colors"
          >
            → Abmelden
          </button>
        </form>
      </div>
    </aside>
  )
}
