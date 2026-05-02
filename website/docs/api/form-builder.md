---
sidebar_position: 2
---

# FormBuilder

The main builder component. Combines a drag-and-drop canvas, toolbox, and editor sidebar.

```tsx
<FormBuilder
  ref={builderRef}
  config={config}
  form={{ component: FormWrapper }}
  initialData={savedForm}
  onChange={(structure) => {}}
  onSubmit={(formData) => {}}
/>
```

## Props

| Prop | Type | Description |
|---|---|---|
| `config` | `Config` | Component registry (required) |
| `ref` | `Ref<FormBuilderHandle>` | Imperative handle |
| `form` | `FormConfig` | Custom form wrapper for preview mode |
| `initialData` | `SerializedFormItem[]` | Pre-populate the canvas |
| `onChange` | `(data: SerializedFormItem[]) => void` | Fires on drag, edit, or delete |
| `onSubmit` | `(data: Record<string, unknown>) => void` | Fires when default form is submitted |

## Imperative handle

```ts
interface FormBuilderHandle {
  getFormItems(): SerializedFormItem[]
  reset(): void
}
```

```tsx
const ref = useRef<FormBuilderHandle>(null)
// ...
ref.current?.getFormItems()  // current form structure
ref.current?.reset()          // clear all items
```

## Serialization

```ts
import { serializeFormItems, deserializeFormItems } from 'fjorm'

// Export
const json: SerializedFormItem[] = serializeFormItems(formItems)

// Rehydrate
const formItems: FormItem[] = deserializeFormItems(json, config)
```
