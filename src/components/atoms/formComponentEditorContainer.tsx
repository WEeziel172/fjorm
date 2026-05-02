import type { ReactNode } from 'react'

export function FormComponentEditorContainer({ children }: { children: ReactNode }) {
  return (
    <div className="form-component-editor-container">{children}</div>
  )
}
