import { useId } from 'react'
import { getSetting } from '../../utils/getSetting'
import type { FormComponentSettings, EditorChangePayload } from '../../types'

export function EditorInput({
  label,
  name,
  handleOnChange,
  settings,
}: {
  label: string
  name: string
  handleOnChange: (payload: EditorChangePayload) => void
  settings: FormComponentSettings
}) {
  const inputId = useId()
  return (
    <div className="form-item">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type="text"
        value={String(getSetting(settings, name) ?? '')}
        onChange={(event) => handleOnChange({ event, name })}
      />
    </div>
  )
}
