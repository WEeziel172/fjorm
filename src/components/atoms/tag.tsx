import type { ReactNode } from 'react'

export function Tag({ children }: { children: ReactNode }) {
  return <div className="tag">{children}</div>
}
