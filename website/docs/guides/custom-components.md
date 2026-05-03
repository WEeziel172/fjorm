---
sidebar_position: 1
---

# Custom Components

Fjorm's real power comes from swapping in your own UI library. Register custom display components for each field type, and the builder renders them everywhere — on the canvas, in the preview, and in the final form.

## The Adapter Pattern

1. Define display components wrapping your UI library's primitives
2. Define editor components (or use declarative editor objects)
3. Create a `FormComponentRegistration[]` array
4. Call `config.addComponents(yourArray)`
5. Pass `config` to `<FormBuilder>`

## Example: Mantine

```tsx
import { TextInput, Select } from '@mantine/core'
import type { FormComponentRegistration, FormComponentProps } from 'fjorm'

function MantineTextInput({ settings, label }: FormComponentProps) {
  return (
    <TextInput
      label={label}
      name={settings.name}
      placeholder={String(settings.placeholder ?? '')}
      required={settings.required}
    />
  )
}

function MantineSelect({ settings, label, options }: FormComponentProps) {
  return (
    <Select
      label={label}
      name={settings.name}
      required={settings.required}
      data={options?.map(o => ({ value: o.value, label: o.title })) ?? []}
    />
  )
}

const myComponents: FormComponentRegistration[] = [
  {
    key: 'TextInput',
    icon: FaFont,
    settings: { label: 'Text input', name: 'TextInput' },
    component: MantineTextInput,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'SelectInput',
    icon: FaList,
    options: [],
    settings: { label: 'Select', name: 'Select' },
    component: MantineSelect,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox', options: 'EditorOptions' },
  },
]
```

## Custom Form Wrapper

Use the `form` prop on `FormBuilder` or `FormDisplay` to wrap fields in a UI library's form container:

```tsx
function FormWrapper({ children, onSubmit, fjormValues }: Record<string, unknown> & {
  children?: React.ReactNode
  onSubmit?: (data: Record<string, unknown>) => void
  fjormValues?: Record<string, unknown>
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data: Record<string, unknown> = {}
    formData.forEach((value, key) => { data[key] = value })
    if (fjormValues) Object.assign(data, fjormValues)
    onSubmit?.(data)
  }

  return <Box component="form" onSubmit={handleSubmit}>{children}</Box>
}

const formConfig: FormConfig = { component: FormWrapper }

<FormBuilder config={config} form={formConfig} />
```

## Display-Only Components

Use `providesValue: false` for components that are purely decorative or structural — headers, paragraphs, dividers, images. These components are excluded from form submissions.

```ts
const myComponents: FormComponentRegistration[] = [
  {
    key: 'Header',
    icon: FaHeading,
    settings: { label: 'Header', name: 'Header' },
    component: HeaderDisplay,
    editor: HeaderEditor,
    providesValue: false,  // excluded from submitted form data
  },
  {
    key: 'TextInput',
    icon: FaFont,
    settings: { label: 'Text input', name: 'TextInput' },
    component: TextInputDisplay,
    editor: { label: 'EditorInput', name: 'EditorInput' },
    // providesValue defaults to true — included in form submissions
  },
]
```

The built-in `formComponents` already has `providesValue: false` on `Header` and `Paragraph`.

## Example Apps

Ready-to-run examples in the repo:

| Library | Directory |
|---|---|
| Ant Design v5 | `examples/antd/` |
| Material UI v5 | `examples/mui/` |
| Mantine v7 | `examples/mantine/` |
