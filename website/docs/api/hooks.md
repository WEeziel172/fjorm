---
sidebar_position: 5
---

# Hooks API

Full reference for every hook and function exported by Fjorm.

## `useFormItems`

The core hook for managing a form's item list. Used by `FormBuilder` internally, but exported for custom builders.

```ts
function useFormItems(
  config: Config,
  initialData: SerializedFormItem[] | undefined,
  onChange?: (data: SerializedFormItem[]) => void,
): {
  formItems: FormItem[]
  setFormItems: Dispatch<SetStateAction<FormItem[]>>
  deleteItem: (id: string) => string
  findItem: (id: string) => FormItem | undefined
  changeSettings: (id: string, settings: FormComponentSettings) => void
  changeOptions: (id: string, options: FormComponentOption[]) => void
  addItem: (key: string, destinationIndex: number) => void
  reorderItems: (startIndex: number, endIndex: number) => void
}
```

**Example:**

```ts
const { formItems, addItem, deleteItem, changeSettings } = useFormItems(config, initialData, onChange)

// Add a TextInput at position 0
addItem('TextInput', 0)

// Change an item's label
changeSettings('item-1', { label: 'Email', name: 'email' })

// Remove an item
deleteItem('item-1')
```

`changeSettings` and `changeOptions` read from refs to avoid stale closures — safe to call from any callback.

---

## `useFormBuilderDragDrop`

Hook for @dnd-kit event handling. Returns callbacks for `DndContext` and tracks the active drag ID. Handles all drag operations: toolbox→canvas, canvas reorder, container in/out moves.

```ts
function useFormBuilderDragDrop(
  addItem: (key: string, index: number, parentId?: string) => void,
  reorderItems: (from: number, to: number, parentId?: string) => void,
  moveItem: (id: string, toParentId: string | undefined, toIndex: number) => void,
  getItemIndex: (id: string, parentId?: string) => number,
  getParentId: (id: string) => string | undefined,
  getRootItemCount: () => number,
): {
  activeId: string | null
  onDragStart: (event: DragStartEvent) => void
  onDragEnd: (event: DragEndEvent) => void
}
```

**Example:**

```tsx
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { useFormBuilderDragDrop } from 'fjorm'

const { activeId, onDragStart, onDragEnd } = useFormBuilderDragDrop(
  addItem, reorderItems, moveItem, getItemIndex, getParentId, getRootItemCount,
)

<DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
  <FormContainer ... />
  <ToolBox ... />
  <DragOverlay>
    {activeId && <ItemPreview id={activeId} />}
  </DragOverlay>
</DndContext>
```

Uses `data.current.kind` on draggable/droppable elements to identify whether the source/target is a toolbox item, canvas item, container dropzone, or canvas root.

---

## `useEditorChange`

Converts an `EditorChangePayload` (checkbox-aware) into a simple `{ name, value }` call. Used by editor components.

```ts
function useEditorChange(
  onValueChange: (payload: { name: string; value: unknown }) => void,
): (payload: EditorChangePayload) => void
```

---

## `useEditorState`

Manages local settings/options state for an editor, syncing from prop changes.

```ts
function useEditorState(
  id: string,
  currentSettings: FormComponentSettings,
  currentOptions: FormComponentOption[] | undefined,
  onChange: (payload: { id: string; settings: FormComponentSettings }) => void,
  onChangeOptions: (payload: { id: string; options: FormComponentOption[] }) => void,
): {
  settings: FormComponentSettings
  options: FormComponentOption[]
  handleOnChangeSettings: (payload: { name: string; value: unknown }) => void
  handleOnChangeOptions: (payload: { name: string; options: FormComponentOption[] }) => void
}
```

---

## `useOptionsManager`

CRUD for editable option lists (used by `EditorOptions`).

```ts
function useOptionsManager(
  currOptions: FormComponentOption[] | undefined,
  name: string,
  onChange?: (payload: { name: string; options: FormComponentOption[] }) => void,
): {
  options: FormComponentOption[]
  addOption: () => void
  editOption: (id: string, field: string, value: string) => void
  deleteOption: (id: string) => void
}
```
