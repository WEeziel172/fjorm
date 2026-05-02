import { useId } from 'react'
import { getSetting } from '../../utils/getSetting'
import type { FormComponentSettings, EditorChangePayload } from '../../types'

export function EditorCheckbox({
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
        checked={Boolean(getSetting(settings, name))}
        onChange={(event) => handleOnChange({ event, name })}
        type="checkbox"
      />
    </div>
  )
}
