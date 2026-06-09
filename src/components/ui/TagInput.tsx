'use client'

import { useState } from 'react'

// Tag-Editor: zeigt Chips, neue per Enter/Komma hinzufügen, Vorschläge anklickbar.
// Schreibt die Tags in ein verstecktes Input (JSON-Array) für Server Actions.
export function TagInput({
  name,
  label,
  initial = [],
  suggestions = [],
  placeholder = 'Tag eingeben + Enter',
}: {
  name: string
  label: string
  initial?: string[]
  suggestions?: string[]
  placeholder?: string
}) {
  const [tags, setTags] = useState<string[]>(initial)
  const [input, setInput] = useState('')

  const add = (value: string) => {
    const v = value.trim()
    if (!v || tags.includes(v)) return
    setTags([...tags, v])
    setInput('')
  }
  const remove = (value: string) => setTags(tags.filter((t) => t !== value))

  const openSuggestions = suggestions.filter((s) => !tags.includes(s))

  return (
    <div>
      <label className="field-label">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      <div className="border border-border bg-white px-2 py-2 flex flex-wrap gap-1.5 items-center min-h-[44px]">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs px-2 py-1"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              className="hover:text-dark"
              aria-label={`${t} entfernen`}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add(input)
            } else if (e.key === 'Backspace' && !input && tags.length) {
              remove(tags[tags.length - 1])
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-w-[140px] px-1 py-1 text-sm focus:outline-none"
        />
      </div>
      {openSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {openSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-[11px] px-2 py-0.5 border border-border text-text-secondary hover:border-dark hover:text-dark transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
