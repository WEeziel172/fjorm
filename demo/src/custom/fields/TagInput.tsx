import { useState } from 'react'
import type { FormComponentProps } from 'fjorm'

export default function TagInput({ settings, options, value, onChangeValue }: FormComponentProps) {
  const initialTags: string[] = Array.isArray(value) ? (value as string[]) : []
  const [tags, setTags] = useState<string[]>(initialTags)
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      const next = [...tags, trimmed]
      setTags(next)
      onChangeValue?.(next)
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag)
    setTags(next)
    onChangeValue?.(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const availableOptions = options?.filter((opt) => !tags.includes(opt.value)) ?? []

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        {settings.label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
        {tags.map((tag) => (
          <span key={tag} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', background: '#eef2ff', color: '#4f46e5',
            borderRadius: 4, fontSize: 12, fontWeight: 500,
          }}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontSize: 14, padding: 0, lineHeight: 1 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter..."
          style={{ flex: 1, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}
        />
        <button type="button" onClick={addTag}
          style={{ padding: '6px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
          Add
        </button>
      </div>
      {availableOptions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
          {availableOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                const next = [...tags, opt.value]
                setTags(next)
                onChangeValue?.(next)
              }}
              style={{ padding: '2px 8px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}
            >
              + {opt.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
