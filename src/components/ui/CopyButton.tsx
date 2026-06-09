'use client'

import { useState } from 'react'

export function CopyButton({ text, label = 'URL kopieren' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          /* ignore */
        }
      }}
      className="font-sans text-[11px] text-text-secondary hover:text-dark transition-colors"
    >
      {copied ? '✓ kopiert' : label}
    </button>
  )
}
