---
sidebar_position: 4
---

# Custom FormBuilder

`FormBuilder` is a composition of exported hooks and layout components. You can build your own version with a different layout, additional panels, or a completely custom UI.

This guide walks through building a three-column builder — toolbox on the left, canvas in the center, editor panel on the right.

## Full example

```tsx
import { useState, useCallback } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  Config,
  useFormItems,
  useFormBuilderDragDrop,
  serializeFormItems,
  FormContainer,
  ToolBox,
  ToolboxItem,
  EditorToolBox,
  FormDisplay,
  type FormItem,
  type SerializedFormItem,
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

  // --- Form items CRUD ---
  const {
    formItems,
    deleteItem,
    findItem,
    changeSettings,
    changeOptions,
    addItem,
    reorderItems,
    moveItem,
  } = useFormItems(config, initialData, onChange)

  // --- Drag & drop ---
  const getItemIndex = useCallback(
    (id: string, parentId?: string) => {
      if (parentId) return findItem(parentId)?.children?.findIndex(c => c.id === id) ?? -1
      return formItems.findIndex(item => item.id === id)
    },
    [formItems, findItem],
  )
  const getParentId = useCallback((id: string) => {
    for (const item of formItems) {
      if (item.children?.some(c => c.id === id)) return item.id
    }
  }, [formItems])

  const { activeId, onDragStart, onDragEnd } = useFormBuilderDragDrop(
    addItem, reorderItems, moveItem,
    getItemIndex, getParentId, () => formItems.length,
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <ToolBox formComponents={config.components} previewForm={previewForm}
            setPreviewForm={setPreviewForm} activeDragKey={activeId} />
        </div>
        <div style={{ flex: 1 }}>
          {previewForm ? (
            <FormDisplay form={form} config={config}
              data={serializeFormItems(formItems)} onSubmit={onSubmit} />
          ) : (
            <FormContainer formItems={formItems}
              onDeleteFormItem={onDeleteFormItem} onEditFormItem={onEditFormItem} />
          )}
        </div>
        {currentEditor && (
          <div style={{ width: 300, flexShrink: 0 }}>
            <EditorToolBox currentEditor={currentEditor}
              onClose={() => setCurrentEditor(null)}
              onChangeFormItemSettings={changeSettings}
              onChangeFormItemOptions={changeOptions} />
          </div>
        )}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId && config.getComponent(activeId)?.icon ? (
          <ToolboxItem icon={config.getComponent(activeId)!.icon!}
            name={config.getComponent(activeId)!.settings.label} />
        ) : null}
      </DragOverlay>
    </DndContext>
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
