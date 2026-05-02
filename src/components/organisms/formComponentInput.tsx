import { useId } from 'react'
import { FormItemDisplay } from '../atoms/formItemDisplay'
import { FormItemLabel } from '../atoms/formItemLabel'
import type { FormComponentProps } from '../../types'

export function FormComponentInput({
  label,
  style,
  settings,
  children,
  value,
  onChangeValue,
}: FormComponentProps) {
  const inputId = useId()
  return (
    <div style={style} className="form-component">
      <FormItemDisplay>
        <FormItemLabel required={settings.required} label={label} htmlFor={inputId} />
        {/* Uncontrolled input — see FormDisplay for value tracking via onChangeValue */}
        <input
          id={inputId}
          type="text"
          defaultValue={String(value ?? '')}
          className="form-input"
          placeholder={String(settings.placeholder ?? '')}
          name={settings.name}
          required={Boolean(settings.required)}
          onChange={(e) => onChangeValue?.(e.target.value)}
        />
      </FormItemDisplay>
      {children}
    </div>
  )
}
