import type { ReactNode } from 'react'
import type { FormComponentSettings } from '../../types'

export function FormComponentHeader({
  settings,
  children,
  headingLevel: Heading = 'h3',
}: {
  settings: FormComponentSettings
  children?: ReactNode
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) {
  return (
    <Heading className="form-component">
      {settings.label}
      {children}
    </Heading>
  )
}
