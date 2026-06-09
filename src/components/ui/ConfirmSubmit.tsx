'use client'

import { useFormStatus } from 'react-dom'

// Submit-Button mit Sicherheitsabfrage — für Löschaktionen.
export function ConfirmSubmit({
  children = 'Löschen',
  message = 'Wirklich löschen? Dies kann nicht rückgängig gemacht werden.',
  className = 'btn-danger',
}: {
  children?: React.ReactNode
  message?: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault()
      }}
    >
      {pending ? 'Wird gelöscht…' : children}
    </button>
  )
}
