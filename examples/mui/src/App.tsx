import { useState, useRef, useCallback } from 'react'
import { Config, FormBuilder, FormDisplay } from 'fjorm'
import type { FormBuilderHandle, SerializedFormItem } from 'fjorm'
import 'fjorm/dist/index.css'
import { formComponents, FormWrapper } from './formComponents'

type View = 'build' | 'preview'

const btnBase = {
  padding: '6px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13,
  cursor: 'pointer', border: '2px solid #e5e7eb', background: '#fff', color: '#6b7280',
} as const

const btnActive = (color: string) => ({
  ...btnBase, border: `2px solid ${color}`, background: '#e3f2fd', color: color,
})

export default function App() {
  const config = new Config()
  config.addComponents(formComponents)

  const builderRef = useRef<FormBuilderHandle>(null)
  const [view, setView] = useState<View>('build')
  const [formStructure, setFormStructure] = useState<SerializedFormItem[]>([])
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null)

  const handlePreview = useCallback(() => {
    const data = builderRef.current?.getFormItems()
    if (data && data.length > 0) {
      setFormStructure(data)
      setView('preview')
    }
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 52, background: '#fff', borderBottom: '1px solid #e5e7eb',
        flexShrink: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1f2937' }}>
          Fjorm + Material UI
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('build')}
            style={view === 'build' ? btnActive('#1976d2') : btnBase}>Build</button>
          <button onClick={handlePreview}
            style={view === 'preview' ? btnActive('#1976d2') : btnBase}>Preview</button>
        </div>
      </nav>

      {view === 'build' ? (
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <FormBuilder ref={builderRef} config={config}
            initialData={formStructure.length > 0 ? formStructure : undefined} />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
            {formStructure.length > 0 ? (
              <FormDisplay data={formStructure} config={config}
                onSubmit={setSubmittedData} form={{ component: FormWrapper }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 100 }}>
                <p style={{ fontSize: 16, margin: '0 0 4px' }}>No form yet</p>
                <p style={{ fontSize: 13, margin: 0 }}>Switch to Build and create a form first.</p>
              </div>
            )}
          </div>
          {submittedData && (
            <div style={{
              width: 300, background: '#1a1f2e', color: '#e2e5ed', padding: 20,
              overflowY: 'auto', fontFamily: 'monospace', fontSize: 12, flexShrink: 0,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8990a5', marginBottom: 12 }}>
                Submitted
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#a5b4fc', lineHeight: 1.6 }}>
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
