import { useRef } from 'react'
import { Config, FormBuilder, formComponents } from 'fjorm'
import type { FormBuilderHandle } from 'fjorm'
import 'fjorm/dist/index.css'

export default function App() {
  const config = new Config()
  config.addComponents(formComponents)
  const builderRef = useRef<FormBuilderHandle>(null)

  return (
    <div className="demo-wrapper">
      <header className="demo-header">
        <h1>fjorm</h1>
        <span className="demo-badge">React Form Builder</span>
      </header>
      <div className="demo-builder">
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
