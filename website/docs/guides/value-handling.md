---
sidebar_position: 2
---

# Value Handling

Fjorm supports two paths for capturing form values. Simple native inputs work automatically; complex non-native components use `onChangeValue`.

## Default form (built-in `<form>`)

1. Simple components (`<input>`, `<select>`, `<textarea>`) are uncontrolled — the browser owns their state
2. Complex components call `onChangeValue` to push their value into the form
3. On submit, tracked values take priority over `FormData`, and unchecked checkboxes default to `false`

## Custom form wrapper

When using a UI library form wrapper, `FormDisplay` passes tracked values as the `fjormValues` prop. Merge them with your library's form state on submit.

## Pre-filling values

```tsx
const data: SerializedFormItem[] = [
  {
    id: '1', key: 'TextInput',
    settings: { label: 'Email', name: 'email' },
    value: 'user@example.com'
  },
  {
    id: '2', key: 'ListSwitcher',
    settings: { label: 'Pages', name: 'pages' },
    options: [{ id: '1', title: 'Dashboard', value: 'dashboard' }],
    value: ['1']
  },
]
<FormDisplay data={data} config={config} onSubmit={handleSubmit} />
```

## onChangeValue pattern

Components that can't serialize into a plain `<input>` (list switchers, tag pickers, rich text editors) use `onChangeValue`:

```tsx
function ListSwitcher({ settings, options, value, onChangeValue }: FormComponentProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(Array.isArray(value) ? value as string[] : [])
  )

  function toggle(id: string) {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
    onChangeValue?.(Array.from(next))   // push array up to the form
  }

  return (
    <div>
      <label>{settings.label}</label>
      {(options ?? []).map(item => (
        <button key={item.id} onClick={() => toggle(item.id)}
          style={{ background: selected.has(item.id) ? 'blue' : 'gray' }}>
          {item.title}
        </button>
      ))}
    </div>
  )
}
```

On submit, the value flows like this:

```
onChangeValue(['1', '3']) → valuesRef.current['pages'] = ['1', '3']
→ submit → dataObj['pages'] = ['1', '3']  (takes priority over FormData)
```
