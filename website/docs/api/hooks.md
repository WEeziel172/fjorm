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
  formItemIdMappings: Record<string, number>
  formItemsRef: MutableRefObject<FormItem[]>
  mappingsRef: MutableRefObject<Record<string, number>>
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

## `useDragDrop`

Manages drag-and-drop placeholder positioning on the canvas.

```ts
function useDragDrop(): {
  placeholderProps: PlaceholderProps | null
  onDragUpdate: (update: DragUpdate) => void
}
```

**Example:**

```tsx
const { placeholderProps, onDragUpdate } = useDragDrop()

<DragDropContext onDragUpdate={onDragUpdate} onDragEnd={...}>
  <FormContainer placeholderProps={placeholderProps} ... />
</DragDropContext>
```

## `handleDragEnd`

Pure function — processes a drag result and calls the appropriate mutation handler. Does not depend on React state.

```ts
function handleDragEnd(
  d: DragResult,
  addItem: (key: string, index: number) => void,
  reorderItems: (from: number, to: number) => void,
): boolean
```

**Example:**

```tsx
const onDragEnd = useCallback(
  (d: DragResult) => { handleDragEnd(d, addItem, reorderItems) },
  [addItem, reorderItems],
)
```

Returns `true` if the drag changed state, `false` if it was a no-op.

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
