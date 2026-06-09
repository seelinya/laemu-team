'use client'

import { useFormStatus } from 'react-dom'
import { clsx } from 'clsx'

export function SubmitButton({
  children,
  className,
  pendingLabel = 'Speichern…',
  variant = 'primary',
}: {
  children: React.ReactNode
  className?: string
  pendingLabel?: string
  variant?: 'primary' | 'secondary'
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(variant === 'primary' ? 'btn-primary' : 'btn-secondary', className)}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
