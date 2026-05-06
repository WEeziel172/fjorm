---
sidebar_position: 4
---

# Types

Complete TypeScript type reference.

## `FormComponentSettings`

```ts
interface FormComponentSettings {
  label: string
  name: string
  required?: boolean
  placeholder?: string
  content?: string
}
```

Custom components can extend this:

```ts
interface NumberSettings extends FormComponentSettings {
  min: number
  max: number
  step: number
}
```

## `FormComponentProps`

Props passed to every display component.

```ts
interface FormComponentProps {
  id: string
  label: string
  style?: CSSProperties
  settings: FormComponentSettings
  options?: FormComponentOption[]
  children?: ReactNode
  editMode?: boolean
  value?: unknown
  onChangeValue?: (value: unknown) => void
  onChangeFormItemSettings?: (payload: { id: string; settings: FormComponentSettings }) => void
  onClick?: (payload: { id: string }) => void
  editor?: EditorDefinition
}
```

## `EditorProps`

Props passed to editor components.

```ts
interface EditorProps {
  settings: FormComponentSettings
  options?: FormComponentOption[]
  formItemId: string
  onValueChange: (payload: { name: string; value: unknown }) => void
  onChangeOptions?: (payload: { name: string; options: FormComponentOption[] }) => void
}
```

## `FormComponentRegistration`

```ts
interface FormComponentRegistration<
  TSettings extends FormComponentSettings = FormComponentSettings,
> {
  key: string
  settings: TSettings
  icon?: ComponentType
  component: ComponentType<FormComponentProps>
  editor: EditorDefinition
  options?: FormComponentOption[]
  providesValue?: boolean
  /** When true, renders a nested droppable zone for child items. */
  isContainer?: boolean
}
```

Set `providesValue: false` for display-only components (headers, paragraphs, dividers, containers) to exclude them from form submissions. Defaults to `true` when omitted. Set `isContainer: true` to enable nested drop zones — the component receives `children` from the renderer.

## `SerializedFormItem`

Portable JSON format for persistence.

```ts
interface SerializedFormItem {
  id: string
  key: string
  settings: FormComponentSettings
  options?: FormComponentOption[]
  value?: unknown
  children?: SerializedFormItem[]
}
```

## `FormComponentOption`

```ts
interface FormComponentOption {
  id: string
  title: string
  value: string
}
```

## `FormConfig`

```ts
interface FormConfig {
  component: ComponentType<FormConfigProps>
  actions?: ReactNode
}
```

## `FormConfigProps`

Props received by the custom form wrapper component.

```ts
interface FormConfigProps {
  children?: ReactNode
  onSubmit?: (data: Record<string, unknown>) => void
  fjormValues: Record<string, unknown>
}
```

## `FormItem`

A registered component instance placed on the canvas. Extends `FormComponentRegistration` with an `id` and an optional runtime `value`.

```ts
interface FormItem extends FormComponentRegistration {
  id: string
  value?: unknown
  children?: FormItem[]
}
```

## `EditorFieldMap`

Declarative editor definition mapping setting keys to editor primitives.

```ts
type EditorFieldMap = Record<string, string | EditorFieldDescriptor>
```

Example: `{ label: 'EditorInput', required: 'EditorCheckbox', content: 'EditorTextArea' }`

## `EditorDefinition`

```ts
type EditorDefinition =
  | ComponentType<EditorProps>
  | EditorFieldMap
```

## `EditorChangePayload`

The event shape passed to editor change handlers. Extracts the checkbox state automatically.

```ts
interface EditorChangePayload {
  event: { target: { type: string; checked?: boolean; value: string } }
  name: string
}
```

## `DndItemData`

Data attached to draggable/droppable elements via @dnd-kit's `data` prop.

```ts
interface DndItemData {
  kind: 'toolbox-item' | 'canvas-item' | 'container-dropzone' | 'canvas-root' | 'drop-indicator'
  componentKey?: string
  containerId?: string
}
```

## `DragEndPayload`

Shape passed to `useFormBuilderDragDrop`'s `onDragEnd` handler after extracting from @dnd-kit's event.

```ts
interface DragEndPayload {
  active: DndActive
  over: DndOver
}
```

## `EditorFieldDescriptor`

Object form for editor fields that need options (e.g., `EditorSelect`).

```ts
interface EditorFieldDescriptor {
  type: string
  options?: { value: string; label: string }[]
}
```

## Full export list

See the sidebars for the complete public API covering hooks, layout primitives, display components, atom components, and editor primitives.
