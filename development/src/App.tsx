import { useRef, type FormEvent } from 'react'
import { Config, FormBuilder, formComponents } from 'fjorm'
import type { FormBuilderHandle, SerializedFormItem } from 'fjorm'

const config = new Config()
config.addComponents(formComponents)

export default function App() {
  const builderRef = useRef<FormBuilderHandle>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const data = builderRef.current?.getFormItems()
    console.log('Form data:', JSON.stringify(data, null, 2))
  }

  const handleChange = (data: SerializedFormItem[]) => {
    console.log('changed:', data.length, 'items')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <FormBuilder
          ref={builderRef}
          config={config}
          onChange={handleChange}
          onSubmit={handleSubmit as unknown as (data: Record<string, unknown>) => void}
        />
      </div>
    </div>
  )
}
