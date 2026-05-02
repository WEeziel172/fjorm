import { Tag } from './tag'

export function FormItemLabel({ label, required, htmlFor }: { label: string; required?: boolean; htmlFor?: string }) {
  return (
    <label className="form-item-label" htmlFor={htmlFor}>
      {label} {required && <Tag>Required</Tag>}
    </label>
  )
}
