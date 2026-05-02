---
sidebar_position: 3
---

# Editor Primitives

Each component registration needs an editor — the sidebar UI for configuring field properties. Fjorm provides two approaches.

## Declarative (quick)

Map field names to built-in editor types. `EditorCompiler` handles the rendering:

```ts
editor: {
  label: 'EditorInput',
  name: 'EditorInput',
  placeholder: 'EditorInput',
  required: 'EditorCheckbox',
  options: 'EditorOptions',
}
```

Available keys: `EditorInput`, `EditorCheckbox`, `EditorTextArea`, `EditorOptions`.

**When to use:** Simple fields that follow the standard label/name/placeholder/required pattern.

## Custom editor component (full control)

Import editor primitives and compose them with any layout or logic:

```tsx
import {
  EditorInput, EditorCheckbox, EditorTextArea, EditorOptions,
  FormComponentEditorContainer, useEditorChange,
  type EditorProps,
} from 'fjorm'

function MyCustomEditor({ settings, options, onValueChange, onChangeOptions }: EditorProps) {
  const handleOnChange = useEditorChange(onValueChange)

  return (
    <FormComponentEditorContainer>
      <EditorInput   settings={settings} name="label"    label="Label"      handleOnChange={handleOnChange} />
      <EditorInput   settings={settings} name="name"     label="Field name" handleOnChange={handleOnChange} />
      <EditorCheckbox settings={settings} name="required" label="Required"  handleOnChange={handleOnChange} />
      <EditorOptions options={options} settings={settings} name="options" label="Items"
        handleOnChange={handleOnChange}
        handleOnChangeOptions={onChangeOptions ?? (() => {})} />
    </FormComponentEditorContainer>
  )
}

// Use it:
const registration: FormComponentRegistration = {
  // ...
  editor: MyCustomEditor,
}
```

**When to use:** Custom layouts, conditional fields, validation logic, or anything beyond the standard field set.

## Available primitives

| Export | Purpose |
|---|---|
| `EditorInput` | Text input for `label`, `placeholder`, `name` fields |
| `EditorCheckbox` | Boolean toggle for `required` field |
| `EditorTextArea` | Multi-line text for `content` field |
| `EditorOptions` | Add/remove/edit option rows (title + value) |
| `FormComponentEditorContainer` | Layout wrapper with consistent padding |
| `EditorCompiler` | Renders declarative editor objects (`{ label: 'EditorInput' }`) into the matching primitives |
| `useEditorChange` | Hook — converts `EditorChangePayload` → `{ name, value }` for `onValueChange` |
| `getSetting` | Type-safe accessor for dynamic settings keys: `getSetting(settings, 'label')` |

## How it works

The declarative object form is syntactic sugar. `EditorCompiler` maps those keys to the same primitives internally. When you pass a `ComponentType<EditorProps>` instead, you bypass the compiler and render directly. Both approaches receive the same `EditorProps`.
