---
sidebar_position: 4
---

# Custom FormBuilder

`FormBuilder` is a composition of exported hooks and layout components. You can build your own version with a different layout, additional panels, or a completely custom UI.

This guide walks through building a three-column builder — toolbox on the left, canvas in the center, editor panel on the right.

## Full example

```tsx
import { useState, useCallback, useRef } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import {
  Config,
  useFormItems,
  useDragDrop,
  applyDragEnd,
  FormContainer,
  ToolBox,
  EditorToolBox,
  FormDisplay,
  type FormItem,
  type SerializedFormItem,
  type DragResult,
} from 'fjorm'
import 'fjorm/dist/index.css'

export function ThreeColumnBuilder({
  config,
  initialData,
  onChange,
  onSubmit,
}: {
  config: Config
  initialData?: SerializedFormItem[]
  onChange?: (data: SerializedFormItem[]) => void
  onSubmit?: (data: Record<string, unknown>) => void
}) {
  // --- State ---
  const [currentEditor, setCurrentEditor] = useState<FormItem | null>(null)
  const [previewForm, setPreviewForm] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // --- Form items CRUD ---
  const {
    formItems,
    deleteItem,
    findItem,
    changeSettings,
    changeOptions,
    addItem,
    reorderItems,
  } = useFormItems(config, initialData, onChange)

  // --- Drag & drop ---
  const { placeholderProps, onDragUpdate } = useDragDrop(containerRef)

  // --- Drag handler ---
  const onDragEnd = useCallback(
    (d: DragResult) => { applyDragEnd(d, addItem, reorderItems) },
    [addItem, reorderItems],
  )

  // --- Edit/delete handlers ---
  const onDeleteFormItem = useCallback(
    ({ id }: { id: string }) => {
      if (currentEditor?.id === id) setCurrentEditor(null)
      deleteItem(id)
    },
    [currentEditor?.id, deleteItem],
  )

  const onEditFormItem = useCallback(
    ({ id }: { id: string }) => {
      const item = findItem(id)
      if (item) setCurrentEditor(item)
    },
    [findItem],
  )

  // --- Render ---
  const serialized = formItems.map(({ id, key, settings, options }) =>
    ({ id, key, settings, options }))

  return (
    <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left: Toolbox */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <ToolBox
            formComponents={config.components}
            previewForm={previewForm}
            setPreviewForm={setPreviewForm}
          />
        </div>

        {/* Center: Canvas / Preview */}
        <div ref={containerRef} style={{ flex: 1 }}>
          {previewForm ? (
            <FormDisplay
              form={form}
              config={config}
              data={serialized}
              onSubmit={onSubmit}
            />
          ) : (
            <FormContainer
              placeholderProps={placeholderProps}
              formItems={formItems}
              onDeleteFormItem={onDeleteFormItem}
              onEditFormItem={onEditFormItem}
            />
          )}
        </div>

        {/* Right: Editor panel */}
        {currentEditor && (
          <div style={{ width: 300, flexShrink: 0 }}>
            <EditorToolBox
              currentEditor={currentEditor}
              onClose={() => setCurrentEditor(null)}
              onChangeFormItemSettings={changeSettings}
              onChangeFormItemOptions={changeOptions}
            />
          </div>
        )}
      </div>
    </DragDropContext>
  )
}
```

## What changed from `FormBuilder`

The default `FormBuilder` uses a toolbox on the RIGHT and toggles between the toolbox and editor panel in the same sidebar slot. This custom version:

1. **Three permanent columns** — toolbox always visible on left, editor always visible on right when an item is selected
2. **No sidebar toggle** — toolbox and editor occupy separate columns
3. **Different layout** — canvas in the center, not sharing space with the sidebar

## Using only the hooks (headless)

You can skip the layout components entirely and use only the hooks for a fully custom renderer:

```tsx
const {
  formItems,
  addItem,
  deleteItem,
  changeSettings,
  reorderItems,
} = useFormItems(config, initialData, onChange)

const { placeholderProps, onDragUpdate } = useDragDrop(containerRef)

// Render formItems with your own UI library
// Wire addItem to a custom palette
// Wire deleteItem to your own delete buttons
// Wire reorderItems to your own drag-and-drop backend
```

The hooks are the state layer — the layout components are just one way to render them.
