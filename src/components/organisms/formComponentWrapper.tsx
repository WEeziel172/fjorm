import type { ReactNode } from 'react'
import { ComponentEditActions } from '../molecules/componentEditActions'

export function FormComponentWrapper({
  onEdit,
  id,
  onDelete,
  children,
}: {
  onEdit: (payload: { id: string }) => void
  id: string
  onDelete: (payload: { id: string }) => void
  children: ReactNode
}) {
  return (
    <div className="form-component-wrapper">
      {children}
      <ComponentEditActions onEdit={onEdit} onDelete={onDelete} id={id} />
    </div>
  )
}
