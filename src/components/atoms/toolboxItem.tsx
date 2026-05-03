import type { ComponentType, CSSProperties } from 'react'

export function ToolboxItem({
  name,
  style,
  icon: Icon,
}: {
  name: string
  style?: CSSProperties
  icon?: ComponentType
}) {
  return (
    <div style={style} className="toolbox-item">
      {Icon ? <Icon /> : null}
      {name}
    </div>
  )
}
