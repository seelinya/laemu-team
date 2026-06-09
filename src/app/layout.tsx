import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LAEMU Team-Backend',
  description: 'Inhaltsverwaltung für die LAEMU-Mitglieder-App — Lehrgänge, Kurse, Lernvideos & Medien.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
