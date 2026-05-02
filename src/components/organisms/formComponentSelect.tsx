import { useId } from 'react'
import { FormItemDisplay } from '../atoms/formItemDisplay'
import { FormItemLabel } from '../atoms/formItemLabel'
import type { FormComponentProps } from '../../types'

export function FormComponentSelect({
  label,
  style,
  settings,
  options,
  children,
  value,
  onChangeValue,
}: FormComponentProps) {
  const selectId = useId()
  return (
    <div style={style} className="form-component">
      <FormItemDisplay>
        <FormItemLabel required={settings.required} label={label} htmlFor={selectId} />
        {/* Uncontrolled input — see FormDisplay for value tracking via onChangeValue */}
        <select
          id={selectId}
          defaultValue={String(value ?? '')}
          className="form-input"
          name={settings.name}
          required={Boolean(settings.required)}
          onChange={(e) => onChangeValue?.(e.target.value)}
        >
          <option disabled value="">
            Select...
          </option>
          {options?.map((option) => (
            <option key={option.id} value={option.value}>
              {option.title}
            </option>
          ))}
        </select>
      </FormItemDisplay>
      {children}
    </div>
  )
}
