import type { FormComponentProps } from 'fjorm'
import { getSetting } from 'fjorm'

export default function SliderField({ settings, label, id }: FormComponentProps) {
  const min = Number(getSetting(settings, 'min') ?? 0)
  const max = Number(getSetting(settings, 'max') ?? 100)
  const step = Number(getSetting(settings, 'step') ?? 1)

  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        {label}: <strong>{settings.value as number ?? min}</strong>
      </label>
      <input
        id={id}
        name={settings.name}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={String(min)}
        style={{ width: '100%' }}
      />
    </div>
  )
}
