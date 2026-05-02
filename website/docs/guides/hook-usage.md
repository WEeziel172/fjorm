---
sidebar_position: 5
---

# Hook Usage Patterns

The hooks are the atomic state primitives. You can use them standalone, outside of `FormBuilder`, for any form-building workflow.

## Managing form items without the builder UI

```tsx
import { useFormItems, Config } from 'fjorm'

function FormStructureManager() {
  const config = new Config()
  config.addComponents(myComponents)

  const { formItems, addItem, deleteItem, changeSettings } =
    useFormItems(config, savedData, (data) => saveToBackend(data))

  return (
    <ul>
      {formItems.map(item => (
        <li key={item.id}>
          {item.settings.label}
          <button onClick={() => deleteItem(item.id)}>Remove</button>
          <button onClick={() => changeSettings(item.id, {
            ...item.settings,
            required: !item.settings.required,
          })}>
            Toggle required
          </button>
        </li>
      ))}
      <button onClick={() => addItem('TextInput', formItems.length)}>
        Add field
      </button>
    </ul>
  )
}
```

No drag-and-drop, no canvas — just CRUD on the item list.

## Programmatic item manipulation

```tsx
const { formItems, addItem, reorderItems, deleteItem } = useFormItems(config)

// Duplicate an item
function duplicate(id: string) {
  const item = formItems.find(i => i.id === id)
  if (item) addItem(item.key, formItems.indexOf(item) + 1)
}

// Move an item to the top
function moveToTop(id: string) {
  const index = formItems.findIndex(i => i.id === id)
  if (index > 0) reorderItems(index, 0)
}

// Clear all items of a specific type
function removeAll(key: string) {
  formItems.filter(i => i.key === key).forEach(i => deleteItem(i.id))
}
```

## Using `useOptionsManager` outside an editor

```tsx
import { useOptionsManager } from 'fjorm'

function StandaloneOptionEditor() {
  const { options, addOption, editOption, deleteOption } = useOptionsManager(
    initialOptions,
    'myField',
    ({ options }) => console.log('Options changed:', options),
  )

  return (
    <div>
      {options.map(opt => (
        <div key={opt.id}>
          <input value={opt.title} onChange={e => editOption(opt.id, 'title', e.target.value)} />
          <input value={opt.value} onChange={e => editOption(opt.id, 'value', e.target.value)} />
          <button onClick={() => deleteOption(opt.id)}>x</button>
        </div>
      ))}
      <button onClick={addOption}>Add option</button>
    </div>
  )
}
```

## Building a custom editor with `useEditorState`

```tsx
import { useEditorState, EditorInput, EditorCheckbox, FormComponentEditorContainer } from 'fjorm'

function MyEditor({ settings: currentSettings, formItemId, onValueChange }) {
  const { settings, handleOnChangeSettings } = useEditorState(
    formItemId,
    currentSettings,
    undefined,
    onValueChange,  // placeholder — real impl would use changeSettings
    () => {},
  )

  return (
    <FormComponentEditorContainer>
      <EditorInput settings={settings} name="label" label="Label"
        handleOnChange={handleOnChangeSettings} />
      <EditorCheckbox settings={settings} name="required" label="Required"
        handleOnChange={handleOnChangeSettings} />
    </FormComponentEditorContainer>
  )
}
```
