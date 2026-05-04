import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { pointerWithin } from '@dnd-kit/core'
import {
  Config, ToolBox, FormContainer, EditorToolBox,
  useFormItems, useFormBuilderDragDrop,
  serializeFormItems, deserializeFormItems,
  type FormItem,
} from 'fjorm'
import type { FormComponentRegistration } from 'fjorm'
import { customComponents } from './customComponents'

const STORAGE_KEY = 'fjorm-custom-builder'

interface Props {
  onFormChange?: (items: FormItem[]) => void
}

export default function CustomFormBuilder({ onFormChange }: Props) {
  const config = useState(() => {
    const c = new Config()
    c.addComponents(customComponents as FormComponentRegistration[])
    return c
  })[0]

  const {
    formItems, setFormItems, addItem, reorderItems, moveItem,
    deleteItem, findItem, changeSettings, changeOptions,
  } = useFormItems(config, undefined, (serialized) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
  })

  const getItemIndex = useCallback(
    (id: string) => formItems.findIndex((item) => item.id === id),
    [formItems],
  )

  const getParentId = useCallback(
    (id: string): string | undefined => {
      for (const item of formItems) {
        if (item.children?.some((c) => c.id === id)) return item.id
      }
    },
    [formItems],
  )

  const { activeId, onDragStart, onDragEnd } = useFormBuilderDragDrop(
    addItem, reorderItems, moveItem,
    getItemIndex, getParentId, () => formItems.length,
  )

  const [editingItem, setEditingItem] = useState<FormItem | null>(null)
  const [importJson, setImportJson] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFormItems(deserializeFormItems(parsed, config))
        }
      }
    } catch { /* ignore corrupt localStorage */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onFormChange?.(formItems)
  }, [formItems, onFormChange])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const toolboxKeys = useMemo(
    () => new Set(config.components.map((c) => c.key)),
    [config.components],
  )

  const activeComponentKey = activeId && toolboxKeys.has(activeId) ? activeId : null
  const draggingComponent = activeComponentKey
    ? config.getComponent(activeComponentKey)
    : undefined

  const currentEditor = editingItem
    ? (findItem(editingItem.id) ?? editingItem)
    : editingItem

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
        background: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0,
      }}>
        <button
          onClick={() => {
            const json = serializeFormItems(formItems)
            navigator.clipboard.writeText(JSON.stringify(json, null, 2))
          }}
          style={{ padding: '4px 10px', fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: 'pointer' }}
        >
          Copy JSON
        </button>
        <button
          onClick={() => {
            try {
              const items = JSON.parse(importJson)
              if (Array.isArray(items)) {
                setFormItems(deserializeFormItems(items, config))
              }
            } catch { /* invalid JSON */ }
          }}
          style={{ padding: '4px 10px', fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: 'pointer' }}
        >
          Import
        </button>
        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY)
            setFormItems([])
          }}
          style={{ padding: '4px 10px', fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: 'pointer', marginLeft: 'auto' }}
        >
          Clear
        </button>
      </div>

      {/* Import textarea */}
      <div style={{ padding: '0 16px 8px', background: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        <textarea
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder="Paste JSON here and click Import..."
          rows={2}
          style={{ width: '100%', padding: 6, fontSize: 11, fontFamily: 'monospace', border: '1px solid #e5e7eb', borderRadius: 4, resize: 'vertical', boxSizing: 'border-box' }}
        />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <FormContainer
            formItems={formItems}
            onEditFormItem={({ id }) => {
              const item = findItem(id)
              if (item) setEditingItem(item)
            }}
            onDeleteFormItem={({ id }) => deleteItem(id)}
          />
          {editingItem ? (
            <EditorToolBox
              currentEditor={currentEditor as FormItem}
              onChangeFormItemSettings={({ id, settings }) => changeSettings(id, settings)}
              onChangeFormItemOptions={({ id, options }) => changeOptions(id, options)}
              onClose={() => setEditingItem(null)}
            />
          ) : (
            <ToolBox
              formComponents={customComponents as FormComponentRegistration[]}
              setPreviewForm={() => {}}
              previewForm={false}
              activeDragKey={activeId}
            />
          )}
          <DragOverlay dropAnimation={null}>
            {draggingComponent ? (
              <div style={{ opacity: 0.85, cursor: 'grabbing' }}>
                <draggingComponent.component
                  settings={draggingComponent.settings}
                  label={draggingComponent.settings.label}
                  id="drag-overlay"
                  options={draggingComponent.options}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
