import { useId } from 'react'
import { getSetting } from '../../utils/getSetting'
import type { FormComponentSettings, EditorChangePayload } from '../../types'

export function EditorSelect({
  label,
  name,
  handleOnChange,
  settings,
  options,
}: {
  label: string
  name: string
  handleOnChange: (payload: EditorChangePayload) => void
  settings: FormComponentSettings
  options?: { value: string; label: string }[]
}) {
  const selectId = useId()
  const value = String(getSetting(settings, name) ?? '')

  return (
    <div className="form-item">
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => handleOnChange({ event, name })}
        style={{
          width: '100%',
          padding: '0.5rem 0.65rem',
          fontSize: '0.85rem',
          fontFamily: 'var(--fj-font)',
          color: 'var(--fj-sidebar-text)',
          background: 'var(--fj-sidebar-input-bg)',
          border: '1px solid var(--fj-sidebar-input-border)',
          borderRadius: 'var(--fj-radius-sm)',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
