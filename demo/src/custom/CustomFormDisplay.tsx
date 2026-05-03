import { Config, FormDisplay, ErrorBoundary } from 'fjorm'
import type { FormComponentRegistration, SerializedFormItem } from 'fjorm'
import { customComponents } from './customComponents'

function CustomFormWrapper({ children, onSubmit, fjormValues }: {
  children?: React.ReactNode
  onSubmit?: (data: Record<string, unknown>) => void
  fjormValues: Record<string, unknown>
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data: Record<string, unknown> = {}

    formData.forEach((value, key) => { data[key] = value })

    if (fjormValues) {
      Object.entries(fjormValues).forEach(([key, value]) => {
        data[key] = value
      })
    }

    onSubmit?.(data)
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <ErrorBoundary>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {children}
        </div>
      </ErrorBoundary>
      <button type="submit" style={{
        marginTop: 20, padding: '10px 28px', border: 'none', borderRadius: 6,
        background: '#7c3aed', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
      }}>
        Submit
      </button>
    </form>
  )
}

interface Props {
  data: SerializedFormItem[]
  onSubmit: (data: Record<string, unknown>) => void
}

export default function CustomFormDisplay({ data, onSubmit }: Props) {
  const config = new Config()
  config.addComponents(customComponents as FormComponentRegistration[])

  return (
    <FormDisplay
      data={data}
      config={config}
      onSubmit={onSubmit}
      form={{ component: CustomFormWrapper }}
    />
  )
}
