import type { FormComponentProps } from 'fjorm'

export default function ColorPickerField({ settings, label, id }: FormComponentProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          id={id}
          name={settings.name}
          type="color"
          defaultValue={settings.value as string ?? '#4f46e5'}
          style={{ width: 40, height: 36, border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', padding: 2 }}
        />
        <span style={{ fontSize: 13, color: '#6b7280' }}>{settings.value as string ?? '#4f46e5'}</span>
      </div>
    </div>
  )
}
