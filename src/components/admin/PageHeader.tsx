import Link from 'next/link'

export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string
  subtitle?: string
  back?: { href: string; label: string }
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link
          href={back.href}
          className="font-sans text-sm text-text-secondary hover:text-dark transition-colors"
        >
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-2">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-dark">{title}</h1>
          {subtitle && <p className="font-sans text-sm text-text-secondary mt-1">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}
