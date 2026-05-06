![Fjorm](assets/header_1.png)

> Modular drag-and-drop form builder for React — bring your own components.

<video src="assets/fjorm_demonstration.mp4" controls width="100%"></video>

[![CI](https://github.com/WEeziel172/fjorm/actions/workflows/ci.yml/badge.svg)](https://github.com/WEeziel172/fjorm/actions/workflows/ci.yml)
[![docs](https://img.shields.io/badge/docs-GitHub_Pages-34a853.svg?logo=github)](https://weeziel172.github.io/fjorm/)
[![semantic-release](https://img.shields.io/badge/release-semantic--release-blue.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)

**Fjorm** is a visual, drag-and-drop form builder and form designer for React 19+. Drag components from a toolbox onto a canvas, configure each field's properties in a sidebar editor, preview the live form, and serialize the result as JSON. The rendering layer is completely pluggable — use raw HTML inputs, Ant Design, MUI, Mantine, or your own design system. Perfect for building form editors, survey creators, page builders, and any tool that needs a visual form constructor.

📖 **Full documentation:** [weeziel172.github.io/fjorm](https://weeziel172.github.io/fjorm/)

<p align="center">
  <img src="https://img.shields.io/badge/drag_and_drop-@dnd--kit/core-ff69b4" alt="DnD">
  <img src="https://img.shields.io/badge/build-tsup-black" alt="tsup">
  <img src="https://img.shields.io/badge/test-vitest-6e9f18" alt="vitest">
</p>

---

## ✨ Features

- **Visual form builder** — drag components from a palette onto a canvas
- **Inline property editing** — edit labels, placeholders, required flags, select options
- **Preview mode** — toggle between builder and rendered-form views
- **UI-framework agnostic** — register your own display components per field type
- **JSON serialization** — export/import form structure as portable JSON
- **TypeScript-first** — full type definitions for the component registry and all APIs
- **Lightweight** — peer deps: React 19+, react-dom 19+; runtime deps: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `uuid`

---

## 📦 Install

```bash
npm install fjorm
```

Fjorm requires React 19+ and react-dom 19+ as peer dependencies. Runtime dependencies (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `uuid`) are installed automatically:

```bash
npm install fjorm react react-dom
```

---

## 🚀 Quick Start

```tsx
import { Config, FormBuilder, formComponents } from 'fjorm'
import 'fjorm/dist/index.css'

export default function App() {
  const config = new Config()
  config.addComponents(formComponents)

  return (
    <div style={{ height: '100vh' }}>
      <FormBuilder config={config} />
    </div>
  )
}
```

That's it — you get a working drag-and-drop form builder with five built-in field types: Header, Paragraph, TextInput, SelectInput, and Container (for grid/column layouts).

---

## 🎨 Adapter Pattern — Bring Your Own Components

Fjorm's real power comes from swapping in your own UI library. Register custom display components for each field type, and the builder renders them everywhere — on the canvas, in the preview, and in the final form.

### Example: Ant Design

```tsx
import { Form, Input, Select, Typography } from 'antd'
import type { FormComponentRegistration, FormComponentProps } from 'fjorm'

// 1. Define display components wrapping Ant Design primitives
function AntTextInput({ settings, label }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name}
      rules={settings.required ? [{ required: true, message: 'Required' }] : undefined}>
      <Input placeholder={settings.placeholder as string} />
    </Form.Item>
  )
}

// 2. Define a form wrapper for the preview/display mode
function FormWrapper({ children }: { children: React.ReactNode }) {
  return <Form layout="vertical">{children}<button type="submit">Save</button></Form>
}

// 3. Register everything in the component array
const myComponents: FormComponentRegistration[] = [
  {
    key: 'TextInput',
    icon: FaTextHeight,
    settings: { label: 'Text input', name: 'TextInput' },
    component: AntTextInput,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  // ... other field types
]

// 4. Wire it up
const config = new Config()
config.addComponents(myComponents)
<FormBuilder config={config} form={{ component: FormWrapper }} />
```

The `editor` property on each registration tells Fjorm what sidebar editor fields to show. Use the **declarative object form** (shown above) for common editor field combinations, or pass a **custom React component** for full control.

### 📚 Example Apps

All examples are accessible in a single playground app with client-side routing. Run them all from one dev server, or browse the live demos.

| Example            | Route         | Live Demo |
| ------------------ | ------------- | --------- |
| **Basic Demo**     | `/`           | [Live](https://weeziel172.github.io/fjorm/demo/) |
| **Ant Design v6**  | `/#/antd`     | [Live](https://weeziel172.github.io/fjorm/demo/#/antd) |
| **Material UI v9** | `/#/mui`      | [Live](https://weeziel172.github.io/fjorm/demo/#/mui) |
| **Mantine v9**     | `/#/mantine`  | [Live](https://weeziel172.github.io/fjorm/demo/#/mantine) |
| **Custom Builder** | `/#/custom`   | [Live](https://weeziel172.github.io/fjorm/demo/#/custom) |

Each example includes a `FormWrapper`, several field types, editor definitions, and a ready-to-run Vite setup. The **Custom Builder** example demonstrates composing a form builder and display from fjorm's primitives — `ToolBox`, `FormContainer`, `EditorToolBox`, and all public hooks.

---

## 📐 Layout Containers — Grids, Rows, and Columns

Fjorm supports **nested layouts** through `Container` components. A Container acts as a droppable zone within the canvas — drag components _into_ it to build grid, column, or section-based form layouts. Containers can be nested (container within container) for complex multi-level structures.

### Built-in Container

The default `formComponents` array includes a `Container` component. Set `isContainer: true` to enable nested droppable zones. The layout is controlled by your component — the built-in example supports Grid, Flex Row, and Flex Column via the `layout` setting:

```tsx
{
  key: 'Container',
  isContainer: true,
  settings: { label: 'Container', name: 'container', layout: 'grid', columns: 2, gap: '0.75rem' },
  icon: GridIcon,
  component: ExampleContainer,
  editor: {
    label: 'EditorInput',
    name: 'EditorInput',
    layout: { type: 'EditorSelect', options: [
      { value: 'grid', label: 'Grid' },
      { value: 'flex-row', label: 'Flex Row' },
      { value: 'flex-column', label: 'Flex Column' },
    ]},
    columns: 'EditorInput',
    gap: 'EditorInput',
  },
  providesValue: false,
}
```

Drag a Container onto the canvas, then drag other components (TextInput, Select, etc.) _into_ the container body. Each container automatically gets a nested drop zone. The `children` prop is passed to your component — you control the layout.

### Framework-Specific Grid Containers

Replace the built-in CSS Grid container with your UI framework's grid system by providing a custom `component`:

```tsx
// Ant Design — Row/Col grid
function AntRowContainer({ children, settings }: FormComponentProps) {
  return (
    <Row gutter={16}>
      {React.Children.map(children, (child) => (
        <Col span={24 / ((settings.columns as number) || 2)}>{child}</Col>
      ))}
    </Row>
  )
}

// Mantine — SimpleGrid
function MantineGridContainer({ children, settings }: FormComponentProps) {
  return (
    <SimpleGrid cols={(settings.columns as number) || 2}>
      {children}
    </SimpleGrid>
  )
}

// MUI — Grid container
function MuiGridContainer({ children, settings }: FormComponentProps) {
  const cols = (settings.columns as number) || 2
  return (
    <Grid container spacing={2}>
      {React.Children.map(children, (child) => (
        <Grid size={12 / cols}>{child}</Grid>
      ))}
    </Grid>
  )
}
```

The `children` prop contains rendered `RecursiveItem` child components. The Container infrastructure (nested `SortableContext`, inner `useDroppable` zone, tree serialization) is framework-agnostic — only the visual layout component needs to be swapped.

### Data Model

Containers use a tree structure. Each `FormItem` and `SerializedFormItem` has an optional `children` array:

```ts
interface FormItem {
  id: string
  key: string
  settings: FormComponentSettings
  // ...
  children?: FormItem[]  // nested child items (for containers)
}

interface SerializedFormItem {
  id: string
  key: string
  settings: FormComponentSettings
  // ...
  children?: SerializedFormItem[]
}
```

Serialization and deserialization handle nesting automatically. Drag-and-drop between containers, from canvas to container, and container to canvas are all supported.

### Drag-and-Drop Behavior

- **Toolbox → Container**: Adds a new component as a child of that container
- **Canvas → Container**: Moves an existing item into the container
- **Container → Canvas**: Moves an item out of the container to the top level
- **Within Container**: Reorder children inside the same container
- **Between Containers**: Move an item from one container to another

All moves preserve the item's settings, options, and values.

---

## 📖 API Reference

### `Config`

The central registry. Register form component definitions.

```ts
class Config {
  get components(): FormComponentRegistration[]
  getComponent(key: string): FormComponentRegistration | undefined
  addComponents(arr: readonly FormComponentRegistration[]): void
}
```

`addComponents` warns on duplicate keys and rebuilds the internal lookup index. Use `getComponent(key)` for O(1) lookups instead of indexing into the components array directly.

### `FormComponentRegistration`

Each registered field type follows this shape:

```ts
interface FormComponentRegistration {
  key: string // unique identifier, e.g. "TextInput"
  settings: FormComponentSettings // default field settings (label, name, …)
  icon?: ComponentType // icon shown in the toolbox
  component: ComponentType<FormComponentProps> // display component
  editor: ComponentType<EditorProps> | EditorFieldMap // editor definition
  options?: FormComponentOption[] // default options (for selects)
  providesValue?: boolean // set to false for display-only components (headers, paragraphs)
  isContainer?: boolean // when true, renders a nested droppable zone
}
```

**Two editor modes:**

- **Function** — pass any React component receiving `EditorProps`
- **Object** — declarative key→editor-type mapping, e.g. `{ label: 'EditorInput', required: 'EditorCheckbox' }`. Values can be strings (`'EditorInput'`) or objects with options (`{ type: 'EditorSelect', options: [...] }`). Available editor types: `EditorInput`, `EditorCheckbox`, `EditorTextArea`, `EditorOptions`, `EditorSelect`.

### `FormBuilder`

```tsx
<FormBuilder
  ref={builderRef} // FormBuilderHandle — getFormItems(), reset()
  config={config} // Config instance (required)
  form={{ component: FormWrapper }} // custom form wrapper for preview mode
  initialData={savedForm} // pre-populate the builder with serialized data
  onChange={(structure) => {}} // called when form structure changes (drag, edit, delete)
  onSubmit={(formData) => {}} // called when the default preview form is submitted
/>
```

> **Note:** `onSubmit` only fires for the default `<form>` (no custom wrapper). When using a custom `form.component`, the wrapper handles its own submission — wire your submit logic inside the wrapper instead.

**Imperative handle** — access via `useRef<FormBuilderHandle>`:

```ts
interface FormBuilderHandle {
  getFormItems(): SerializedFormItem[] // current form structure as JSON
  reset(): void // clear all form items
}
```

### `FormDisplay`

Standalone read-only form renderer (used internally by `FormBuilder` in preview mode):

```tsx
<FormDisplay
  data={serializedItems} // SerializedFormItem[]
  config={config} // Config instance
  form={formWrapper} // optional custom form wrapper
/>
```

### Serialization Utilities

```ts
import { serializeFormItems, deserializeFormItems } from 'fjorm'

// Export form structure as portable JSON
const json: SerializedFormItem[] = serializeFormItems(formItems)

// Rehydrate from saved JSON
const formItems: FormItem[] = deserializeFormItems(json, config)
```

### `FormComponentProps`

The props interface every display component receives. Your adapter components (Ant Design, MUI, Mantine wrappers) are built against this shape:

```ts
interface FormComponentProps {
  id: string                    // Unique item ID
  label: string                 // Display label from settings
  style?: CSSProperties         // Optional style overrides
  settings: FormComponentSettings // All settings for this field
  options?: FormComponentOption[] // Options (for selects, checkboxes, etc.)
  children?: ReactNode          // Optional children
  editMode?: boolean            // True when rendered in builder canvas
  value?: unknown               // Pre-filled value from serialized data
  onChangeValue?: (value: unknown) => void // Push value for complex components
  onChangeFormItemSettings?: (payload) => void // Notify setting changes
  onClick?: (payload) => void   // Click handler (builder mode)
  editor?: EditorDefinition     // Editor definition for the field
}
```

### `FormConfig` & `FormConfigProps`

Custom form wrapper configuration passed to `<FormBuilder form={...}>`:

```ts
interface FormConfig {
  component: ComponentType<FormConfigProps>  // custom form wrapper component
  actions?: ReactNode                        // optional actions (buttons, etc.)
}

interface FormConfigProps {
  children?: ReactNode
  onSubmit?: (data: Record<string, unknown>) => void
  fjormValues: Record<string, unknown>  // all onChangeValue-tracked values
}
```

### `EditorProps`

Props received by editor components:

```ts
interface EditorProps {
  settings: FormComponentSettings
  options?: FormComponentOption[]
  formItemId: string
  onValueChange: (payload: { name: string; value: unknown }) => void
  onChangeOptions?: (payload: { name: string; options: FormComponentOption[] }) => void
}
```

### All Exports

Build your own display components (see Adapter Pattern above) — the library provides the framework, not the fields.

**Components:**

| Export | Kind | Description |
|---|---|---|
| `Config` | Class | Component registry |
| `FormBuilder` | Component | Main builder UI (named export) |
| `FormDisplay` | Component | Standalone read-only form renderer |
| `FormContainer` | Component | Drag-and-drop canvas |
| `ToolBox` | Component | Component palette |
| `EditorToolBox` | Component | Editor sidebar panel |
| `EditorContainer` | Component | Renders editor fields for a form item |
| `FormComponentWrapper` | Component | Wraps form item with edit/delete actions |
| `EditorInput` | Component | Text editor field |
| `EditorCheckbox` | Component | Boolean toggle editor field |
| `EditorTextArea` | Component | Multi-line text editor field |
| `EditorOptions` | Component | Options list editor (add/remove/edit rows) |
| `EditorSelect` | Component | Dropdown select editor with configurable options |
| `EditorCompiler` | Component | Converts `EditorFieldMap` to rendered editor components |
| `FormComponentInput` | Component | Default text input display |
| `FormComponentSelect` | Component | Default select dropdown display |
| `FormComponentHeader` | Component | Default heading display |
| `FormComponentParagraph` | Component | Default paragraph display |
| `ErrorBoundary` | Component | Error boundary wrapper |
| `FormComponentEditorContainer` | Component | Editor layout wrapper |
| `FormItemLabel` | Component | Form field label with required badge |
| `FormItemDisplay` | Component | Label + control layout wrapper |
| `ComponentEditActions` | Component | Edit/delete action buttons |
| `Tag` | Component | Small pill badge |
| `Option` | Component | Single option row (value + title) |
| `ToolboxItem` | Component | Toolbox palette card |
| `FormComponentContainer` | Component | Minimal container display shell |
| `RecursiveItem` | Component | Dispatches container vs regular item rendering |

**Hooks & Utilities:**

| Export | Kind | Description |
|---|---|---|
| `formComponents` | Value | Default component definitions (Header, Paragraph, TextInput, SelectInput, Container) |
| `serializeFormItems` | Function | Convert form items to portable JSON |
| `deserializeFormItems` | Function | Rehydrate JSON back to form items |
| `getSetting` | Function | Type-safe settings access helper |
| `useFormItems` | Hook | Form items state management |
| `useFormBuilderDragDrop` | Hook | DnD event handling via @dnd-kit |
| `useEditorChange` | Hook | Editor change handler |
| `useEditorState` | Hook | Local editor state |
| `useOptionsManager` | Hook | Options list CRUD |

**Types:**

```ts
import type {
  FormComponentSettings,
  FormComponentOption,
  EditorProps,
  FormComponentProps,
  EditorDefinition,
  EditorFieldMap,
  EditorFieldDescriptor,
  FormComponentRegistration,
  FormItem,
  SerializedFormItem,
  FormConfig,
  FormConfigProps,
  EditorChangePayload,
  DragEndPayload,
  DndActive,
  DndOver,
  DndItemData,
  FormBuilderHandle,
} from 'fjorm'
```

---

## 🛠 Development

```bash
# Install dependencies
yarn install

# Build the library (ESM + CJS + type declarations)
yarn build

# Watch mode
yarn dev

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run the playground (demo + all examples in one app)
cd demo && yarn dev
```

### Releases

This project uses [semantic-release](https://semantic-release.gitbook.io) for fully automated versioning. Commits to `main` trigger the CI pipeline, which determines the next version from commit messages, publishes to npm, and creates a GitHub Release.

**Commit conventions** (Conventional Commits):

```
fix: fix crash when deleting edited form item    → patch release (1.0.0 → 1.0.1)
feat: add checkbox field type                    → minor release (1.0.0 → 1.1.0)
feat: redesign public API
BREAKING CHANGE: Config.addComponents signature  → major release (1.0.0 → 2.0.0)
```

No manual version bumping, tagging, or release drafting needed — merge to `main` and semantic-release handles the rest.

### Project Structure

```
fjorm/
├── src/
│   ├── index.ts              # public API barrel
│   ├── types.ts              # TypeScript type definitions
│   ├── styles.css            # builder UI styles
│   ├── utils/
│   │   ├── config.ts         # Config class
│   │   ├── getSetting.ts     # type-safe settings access
│   │   ├── useDragDrop.ts    # useFormBuilderDragDrop hook
│   │   ├── useEditorChange.ts # editor change handler
│   │   ├── useEditorState.ts # local editor state hook
│   │   ├── useFormItems.ts   # useFormItems + serialization
│   │   └── useOptionsManager.ts # option CRUD hook
│   └── components/
│       ├── atoms/            # 8 primitive components
│       ├── molecules/        # 9 composite components
│       ├── organisms/        # 9 business-logic components
│       ├── componentUtils/   # dynamic editor compiler
│       └── builderComponents.ts  # default component definitions
├── tests/
│   ├── setup.ts
│   └── unit/                 # 142 tests across 19 files
├── demo/                     # Playground SPA (demo + all examples)
├── examples/                 # Standalone reference projects
│   ├── antd/                 # Ant Design v6 integration
│   ├── mui/                  # Material UI v9 integration
│   └── mantine/              # Mantine v9 integration
├── tsup.config.ts            # library build config
├── vitest.config.ts          # test config
└── tsconfig.json
```

---

## 🔑 Key Concepts

### How Values Flow

Fjorm supports two value paths — native inputs are captured automatically via the browser's `FormData`, and complex non-native components use the `onChangeValue` callback.

**Default form (built-in `<form>`):**

1. Simple components (`<input>`, `<select>`, `<textarea>`) are uncontrolled — the browser owns their state
2. Complex components (list switchers, tag pickers, custom widgets) call `onChangeValue` to push their value into the form
3. On submit, tracked values take priority over `FormData`, and unchecked checkboxes default to `false`

**Custom form wrapper (UI library integration):**

1. The wrapper receives `fjormValues: Record<string, unknown>` as a prop — all `onChangeValue`-tracked values
2. The wrapper merges `fjormValues` with its own form state on submit
3. See the Mantine example's `FormWrapper` for a working implementation

**Pre-filling values:**

```tsx
const data: SerializedFormItem[] = [
  { id: '1', key: 'TextInput', settings: { label: 'Email', name: 'email' }, value: 'prefilled@test.com' },
  { id: '2', key: 'ListSwitcher', settings: { label: 'Pages', name: 'pages' }, value: ['1', '3'] },
]
<FormDisplay data={data} config={config} onSubmit={handleSubmit} />
```

**Building a component that uses `onChangeValue`:**

```tsx
function ListSwitcher({ settings, options, value, onChangeValue }: FormComponentProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(Array.isArray(value) ? (value as string[]) : []),
  )

  function toggle(id: string) {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
    onChangeValue?.(Array.from(next)) // push array up to the form
  }

  return (
    <div>
      <label>{settings.label}</label>
      {(options ?? []).map((item) => (
        <button
          key={item.id}
          onClick={() => toggle(item.id)}
          style={{ background: selected.has(item.id) ? 'blue' : 'gray' }}
        >
          {item.title}
        </button>
      ))}
    </div>
  )
}
```

The editor for this component uses `EditorOptions` to let users configure the selectable items — see `demo/src/examples/mantine/formComponents.tsx` (or `examples/mantine/src/formComponents.tsx`) for the full working version.

### Building Custom Editors from Primitives

When the declarative editor object isn't enough, compose a custom editor from Fjorm's primitives:

```tsx
import {
  EditorInput,
  EditorCheckbox,
  EditorTextArea,
  EditorOptions,
  FormComponentEditorContainer,
  useEditorChange,
  type EditorProps,
} from 'fjorm'

function MyCustomEditor({ settings, options, onValueChange, onChangeOptions }: EditorProps) {
  const handleOnChange = useEditorChange(onValueChange)

  return (
    <FormComponentEditorContainer>
      <EditorInput settings={settings} name="label" label="Label" handleOnChange={handleOnChange} />
      <EditorInput
        settings={settings}
        name="name"
        label="Field name"
        handleOnChange={handleOnChange}
      />
      <EditorCheckbox
        settings={settings}
        name="required"
        label="Required"
        handleOnChange={handleOnChange}
      />
      <EditorOptions
        options={options}
        settings={settings}
        name="options"
        label="Options"
        handleOnChange={handleOnChange}
        handleOnChangeOptions={onChangeOptions ?? (() => {})}
      />
    </FormComponentEditorContainer>
  )
}

// Use it as the editor:
const registration: FormComponentRegistration = {
  key: 'MyComponent',
  settings: { label: 'My Component', name: 'myComponent' },
  icon: MyIcon,
  component: MyDisplayComponent,
  editor: MyCustomEditor, // function form instead of declarative object
}
```

**Available primitives:**

| Export                         | Purpose                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `EditorInput`                  | Text input (`label`, `placeholder`, `name` fields)                            |
| `EditorCheckbox`               | Boolean toggle (`required` field)                                             |
| `EditorTextArea`               | Multi-line text (`content` field)                                             |
| `EditorOptions`                | Add/remove/edit option rows (title + value)                                   |
| `FormComponentEditorContainer` | Layout wrapper with consistent padding                                        |
| `useEditorChange`              | Hook — converts `EditorChangePayload` → `{ name, value }` for `onValueChange` |

The declarative object form (`{ label: 'EditorInput', required: 'EditorCheckbox' }`) is just syntactic sugar — `EditorCompiler` maps those keys to these same primitives. Use the function form when you need custom layout, conditional fields, or validation beyond what the declarative form supports.

### How Drag-and-Drop Works

Built on **@dnd-kit** (`DndContext`, `useSortable`, `useDroppable`, `DragOverlay`). The toolbox uses `useDraggable` for palette items. The canvas uses `SortableContext` + `useSortable` for reorderable form items. Components with `isContainer: true` get a nested `useDroppable` zone wrapped in their own `SortableContext`. A `DragOverlay` renders a drag preview that follows the cursor. Custom collision detection combines `closestCorners` (for sortable precision) with `pointerWithin` (for container/empty-area detection).

### Component Registration Lifecycle

1. Define display components wrapping your UI library's primitives
2. Define editor components (or use declarative editor objects)
3. Create a `FormComponentRegistration[]` array
4. Call `config.addComponents(yourArray)`
5. Pass `config` to `<FormBuilder>`

The config builds an internal `formComponentMappings` index (key → array position) for O(1) lookups during drag operations.

---

## 📄 License

MIT © WEeziel172
