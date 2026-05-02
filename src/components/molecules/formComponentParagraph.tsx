import type { FormComponentSettings } from '../../types'

export function FormComponentParagraph({
  settings,
  children,
}: {
  settings: FormComponentSettings
  children?: React.ReactNode
}) {
  return (
    <p style={{ whiteSpace: 'pre-line' }} className="form-component">
      {String(settings.content ?? '')}
      {children}
    </p>
  )
}
