import { useState, useCallback } from 'react'
import { Config, serializeFormItems, deserializeFormItems } from 'fjorm'
import type { FormItem, SerializedFormItem } from 'fjorm'
import 'fjorm/dist/index.css'
import { customComponents } from '../custom/customComponents'
import CustomFormBuilder from '../custom/CustomFormBuilder'
import CustomFormDisplay from '../custom/CustomFormDisplay'

type View = 'builder' | 'display'

const tabBase = {
  padding: '6px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13,
  cursor: 'pointer', border: '2px solid #e5e7eb', background: '#fff', color: '#6b7280',
} as const

const tabActive = {
  ...tabBase, border: '2px solid #7c3aed', background: '#f5f3ff', color: '#7c3aed',
}

export default function CustomPage() {
  const [view, setView] = useState<View>('builder')
  const [formItems, setFormItems] = useState<FormItem[]>([])
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null)
  const [formStructure, setFormStructure] = useState<SerializedFormItem[]>([])

  const handleFormChange = useCallback((items: FormItem[]) => {
    setFormItems(items)
  }, [])

  const handleDisplay = useCallback(() => {
    setFormStructure(serializeFormItems(formItems))
    setView('display')
  }, [formItems])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 48, background: '#fff', borderBottom: '1px solid #e5e7eb',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
          Custom Form Builder & Display
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('builder')}
            style={view === 'builder' ? tabActive : tabBase}>Builder</button>
          <button onClick={handleDisplay}
            style={view === 'display' ? tabActive : tabBase}>Display</button>
        </div>
      </nav>

      {view === 'builder' ? (
        <CustomFormBuilder onFormChange={handleFormChange} />
      ) : (
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
            {formStructure.length > 0 ? (
              <CustomFormDisplay data={formStructure} onSubmit={setSubmittedData} />
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 100 }}>
                <p style={{ fontSize: 16, margin: '0 0 4px' }}>No form yet</p>
                <p style={{ fontSize: 13, margin: 0 }}>Build a form first, then switch to Display.</p>
              </div>
            )}
          </div>
          {submittedData && (
            <div style={{
              width: 320, background: '#1a1f2e', color: '#e2e5ed', padding: 20,
              overflowY: 'auto', fontFamily: 'monospace', fontSize: 12, flexShrink: 0,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8990a5', marginBottom: 12 }}>
                Submitted Data
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
