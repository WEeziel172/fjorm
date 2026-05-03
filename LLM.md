# LLM.md — fjorm

Modular drag-and-drop form builder for React 19+. MIT licensed.

## Core Concept

fjorm uses an **adapter/registry pattern**. You define form field types as `FormComponentRegistration` objects, register them in a `Config`, and pass the config to `<FormBuilder>`. Each registration maps a field type to:

- `component` — renders the field on the canvas and in preview
- `editor` — renders the property editor sidebar when the field is selected
- `settings` — default settings (label, name, placeholder, etc.)
- `icon` — toolbox icon (React component)

The library manages drag-and-drop, state, and serialization. You supply the components.

## Quick Start (4 built-in types)

```tsx
import { Config, FormBuilder, formComponents } from 'fjorm'
import 'fjorm/dist/index.css'

export default function App() {
  const config = new Config()
  config.addComponents(formComponents) // Header, Paragraph, TextInput, SelectInput

  return (
    <div style={{ height: '100vh' }}>
      <FormBuilder
        config={config}
        onSubmit={(data) => console.log('form data:', data)}
        onChange={(structure) => console.log('form structure:', structure)}
      />
    </div>
  )
}
```

## Config API

```ts
const config = new Config()

// Register components (can call multiple times to merge)
config.addComponents(arrayOfRegistrations)

// Read all registrations
config.components // FormComponentRegistration[]

// Look up a single registration by key
config.getComponent('TextInput') // FormComponentRegistration | undefined

// Duplicate keys: the last one wins (with console.warn on replacement)
```

## FormComponentRegistration

```ts
interface FormComponentRegistration {
  key: string              // unique identifier, e.g. 'TextInput'
  settings: {              // default settings values
    label: string
    name: string           // used as the form data key on submit
    required?: boolean
    placeholder?: string
    content?: string       // used by Header/Paragraph
    [key: string]: unknown // custom fields are supported
  }
  icon?: ComponentType     // toolbox icon (rendered in the sidebar)
  component: ComponentType<FormComponentProps>  // canvas/preview display
  editor: EditorDefinition // sidebar editor
  options?: FormComponentOption[] // for select/radio/checkbox types
  providesValue?: boolean  // default true — set false for display-only items (headers, dividers)
}

interface FormComponentOption {
  id: string
  title: string
  value: string
}
```

## EditorDefinition — two forms

### 1. EditorFieldMap (simple, declarative)

Maps setting keys to editor primitives. The compiler renders a form row per entry:

```ts
editor: {
  label: 'EditorInput',        // text input for the "label" setting
  name: 'EditorInput',          // text input for the "name" setting
  placeholder: 'EditorInput',   // text input
  required: 'EditorCheckbox',   // checkbox
  content: 'EditorTextArea',    // textarea
}
```

Available editor primitives: `'EditorInput'`, `'EditorCheckbox'`, `'EditorTextArea'`, `'EditorOptions'`

### 2. Custom editor component

For complex editors, provide a React component receiving `EditorProps`:

```ts
interface EditorProps {
  settings: FormComponentSettings
  options?: FormComponentOption[]
  formItemId: string
  onValueChange: (payload: { name: string; value: unknown }) => void
  onChangeOptions?: (payload: { name: string; options: FormComponentOption[] }) => void
}
```

Set `editor: MyCustomEditorComponent`.

## display component props (FormComponentProps)

Your `component` receives:

```ts
interface FormComponentProps {
  id: string                    // unique instance id (for edit/delete callbacks)
  label: string
  settings: FormComponentSettings
  options?: FormComponentOption[]
  children?: ReactNode
  editMode?: boolean            // true when rendered on the builder canvas
  value?: unknown               // current value (for value-providing fields)
  onChangeValue?: (value: unknown) => void
  onChangeFormItemSettings?: (payload: { id: string; settings: FormComponentSettings }) => void
  onClick?: (payload: { id: string }) => void  // triggers editor open
}
```

## FormBuilder Props

```ts
interface FormBuilderProps {
  config: Config                          // required — component registry
  form?: FormConfig                       // custom form wrapper for preview mode
  initialData?: SerializedFormItem[]      // restore previously saved form
  onChange?: (data: SerializedFormItem[]) => void  // fires on every form structure change
  onSubmit?: (data: Record<string, unknown>) => void  // fires on preview submit
}
```

## FormBuilder Ref (imperative handle)

```tsx
const ref = useRef<FormBuilderHandle>(null)

// Get serialized form items (for saving)
const items = ref.current?.getFormItems() // SerializedFormItem[]

// Reset the entire builder state
ref.current?.reset()
```

```ts
interface FormBuilderHandle {
  getFormItems: () => SerializedFormItem[]
  reset: () => void
}
```

## Custom Form Wrapper (FormConfig)

Wrap the preview form in your own layout/design system:

```ts
const formConfig: FormConfig = {
  component: ({ children, onSubmit, fjormValues }) => (
    <Form layout="vertical" onFinish={onSubmit}>
      {children}
      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  ),
  actions: <SubmitButton />,  // optional extra actions node
}
```

Pass as `<FormBuilder form={formConfig} ... />`.

## FormDisplay — preview/display-only mode

Use `<FormDisplay>` standalone to render a saved form without the builder UI:

```tsx
<FormDisplay
  data={serializedFormItems}   // SerializedFormItem[]
  config={config}              // same Config instance
  form={formConfig}            // optional — same FormConfig
  onSubmit={(data) => {}}      // optional — form data handler
/>
```

## Serialization

```ts
import { serializeFormItems, deserializeFormItems } from 'fjorm'

// FormItem[] → SerializedFormItem[] (strips React-specific fields)
const serialized = serializeFormItems(formItems)

// SerializedFormItem[] → FormItem[] (restores with config)
const formItems = deserializeFormItems(serialized, config)
```

```ts
interface SerializedFormItem {
  id: string
  key: string          // references a FormComponentRegistration key
  settings: FormComponentSettings
  options?: FormComponentOption[]
  value?: unknown
}
```

## Hooks

All hooks are exported publicly for custom builder layouts:

```ts
// Core form items management
const { formItems, setFormItems, deleteItem, findItem, changeSettings, changeOptions, addItem, reorderItems } = useFormItems(config, initialData?, onChange?)

// Drag-and-drop wiring (accepts a container ref)
const { placeholderProps, onDragUpdate } = useDragDrop(containerRef)

// Apply drag result to form items
applyDragEnd(dragResult, addItem, reorderItems, { sourceDroppableId })

// Local editor state (stores pending edits before applying)
const { editorState, setEditorField, applyEditorState } = useEditorState()

// Editor change handler (for EditorFieldMap)
const handleChange = useEditorChange(setEditorField)

// Options CRUD (for select/checkbox/radio options)
const { addOption, deleteOption, changeOption, deleteAllOptions } = useOptionsManager(onChangeOptionsCallback)
```

## Custom Form Component Pattern

```tsx
// 1. Define the display component
function MyTextInput({ label, value, onChangeValue, onChangeFormItemSettings, editMode, settings }: FormComponentProps) {
  return (
    <div>
      <label>{label}</label>
      <input
        value={String(value ?? '')}
        onChange={(e) => onChangeValue?.(e.target.value)}
        placeholder={settings.placeholder}
        disabled={editMode} // read-only on canvas
      />
    </div>
  )
}

// 2. Define the editor (EditorFieldMap)
const myTextEditor: EditorFieldMap = {
  label: 'EditorInput',
  placeholder: 'EditorInput',
  required: 'EditorCheckbox',
}

// 3. Register
config.addComponents([{
  key: 'MyTextInput',
  settings: { label: 'My Text', name: 'my_text' },
  icon: SomeIcon,
  component: MyTextInput,
  editor: myTextEditor,
}])
```

## Layout Primitives (for custom builders)

All exported for assembling a custom builder layout:

| Component | Purpose |
|-----------|---------|
| `FormContainer` | The DnD canvas (droppable area) |
| `ToolBox` | Sidebar with component palette + preview/save buttons |
| `EditorToolBox` | Sidebar with property editor for selected field |
| `EditorContainer` | Wraps editor content |
| `FormComponentWrapper` | Card wrapping each field on the canvas (with edit/delete actions) |

## Built-in Display Primitives

| Export | Use for |
|--------|---------|
| `FormComponentInput` | Text input fields |
| `FormComponentSelect` | Select dropdown fields |
| `FormComponentHeader` | Title/heading display |
| `FormComponentParagraph` | Paragraph text display |

## Utility

```ts
getSetting(settings, 'fieldName') // unknown — type-safe settings access
```

## CSS Custom Properties (design tokens)

Override these to match your design system:

```css
:root {
  --fj-color-bg: #f5f5f7;
  --fj-color-surface: #ffffff;
  --fj-color-border: #e5e7eb;
  --fj-color-text: #1f2937;
  --fj-color-primary: #5b6eff;
  --fj-color-primary-hover: #4a5cf0;
  --fj-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...;
  /* See src/styles.css for full list */
}
```

## Common Pitfalls

1. **Every field needs a unique `name`** in its settings. Duplicate names cause the second field to be ignored during value collection.

2. **Set `providesValue: false`** for decorative items (Headers, Paragraphs, dividers). Otherwise their `name` key gets `false` in the submitted data.

3. **Don't mutate `Config` after passing to `FormBuilder`**. If you need dynamic registrations, create a new Config.

4. **`editMode` prop** — your component should render read-only on the canvas (`editMode: true`) and interactive in preview (`editMode: false` / undefined).

5. **The library imports are ESM + CJS** — if you see duplicate React instances, ensure your bundler deduplicates `react` and `react-dom`.

6. **CSS must be imported**: `import 'fjorm/dist/index.css'` — the builder is unstyled without it.

## Peer Dependencies

- `react` ^19.0.0
- `react-dom` ^19.0.0

Runtime deps (installed automatically): `@hello-pangea/dnd`, `uuid`.
