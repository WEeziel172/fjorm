import { useState } from 'react'
import type { FormComponentProps } from 'fjorm'

export default function RatingField({ settings, id }: FormComponentProps) {
  const max = 5
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(Number(settings.value ?? 0))

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        {settings.label}
      </label>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: max }, (_, i) => {
          const filled = i < (hovered || selected)
          return (
            <button
              key={i}
              type="button"
              name={settings.name}
              value={selected}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(i + 1)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 24,
                color: filled ? '#f59e0b' : '#d1d5db', padding: 0, lineHeight: 1,
                transition: 'color 0.1s',
              }}
            >
              ★
            </button>
          )
        })}
        <input type="hidden" name={settings.name} value={selected} />
      </div>
    </div>
  )
}
