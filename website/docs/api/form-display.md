---
sidebar_position: 3
---

# FormDisplay

Standalone read-only form renderer, used internally by `FormBuilder` in preview mode. Can also be used independently to render a form from serialized data.

```tsx
<FormDisplay
  data={serializedItems}
  config={config}
  form={formWrapper}
  onSubmit={(values) => {}}
/>
```

## Props

| Prop | Type | Description |
|---|---|---|
| `data` | `SerializedFormItem[]` | Form structure |
| `config` | `Config` | Component registry |
| `form` | `FormConfig` | Optional custom form wrapper |
| `onSubmit` | `(data: Record<string, unknown>) => void` | Fires on form submit |

## Value handling

`FormDisplay` supports two value paths:

1. **Native inputs** (`<input>`, `<select>`, `<textarea>`) — captured automatically via `FormData`
2. **Complex components** — call `onChangeValue` to push values into the form

On submit, `onChangeValue`-tracked values take priority over `FormData`. Unchecked checkboxes default to `false`.

## Custom form wrapper

When using a UI library (Ant Design, Mantine, MUI), pass a form wrapper via `form.component`:

```tsx
function FormWrapper({ children, onSubmit, fjormValues }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const result = {}
    data.forEach((v, k) => { result[k] = v })
    // Merge tracked values from complex components
    Object.assign(result, fjormValues)
    onSubmit?.(result)
  }

  return <form onSubmit={handleSubmit}>{children}</form>
}

<FormDisplay data={data} config={config} form={{ component: FormWrapper }} />
```

The `fjormValues` prop contains values from components that use `onChangeValue`.
