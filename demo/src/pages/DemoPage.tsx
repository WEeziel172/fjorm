import { useRef } from 'react'
import { Config, FormBuilder, formComponents } from 'fjorm'
import type { FormBuilderHandle } from 'fjorm'
import 'fjorm/dist/index.css'

export default function DemoPage() {
  const config = new Config()
  config.addComponents(formComponents)
  const builderRef = useRef<FormBuilderHandle>(null)

  return (
    <div className="page-example" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <FormBuilder
          ref={builderRef}
          config={config}
          onSubmit={(data) => {
            alert('Form submitted:\n' + JSON.stringify(data, null, 2))
          }}
          onChange={(structure) => {
            console.log('Form structure:', structure)
          }}
        />
      </div>
    </div>
  )
}
