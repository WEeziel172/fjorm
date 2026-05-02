import { useId } from 'react'
import { getSetting } from '../../utils/getSetting'
import type { FormComponentSettings, EditorChangePayload } from '../../types'

export function EditorTextArea({
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
  const textareaId = useId()
  return (
    <>
      <div className="form-item">
        <label htmlFor={textareaId}>{label}</label>
      </div>
      <div className="form-item">
        <textarea
          id={textareaId}
          style={{ width: '100%' }}
          value={String(getSetting(settings, name) ?? '')}
          onChange={(event) => handleOnChange({ event, name })}
        />
      </div>
    </>
  )
}
