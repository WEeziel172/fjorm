import type { FormComponentProps } from 'fjorm'

export default function DividerField({ settings }: FormComponentProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      {settings.label && (
        <span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {settings.label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
    </div>
  )
}
