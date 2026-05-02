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

## `SerializedFormItem`

Portable JSON format for persistence.

```ts
interface SerializedFormItem {
  id: string
  key: string
  settings: FormComponentSettings
  options?: FormComponentOption[]
  value?: unknown
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
  component: ComponentType<Record<string, unknown>>
  actions?: ReactNode
}
```

## `FormItem`

A registered component instance placed on the canvas. Extends `FormComponentRegistration` with an `id` and an optional runtime `value`.

```ts
interface FormItem extends FormComponentRegistration {
  id: string
  value?: unknown
}
```

## `EditorChangePayload`

The event shape passed to editor change handlers. Extracts the checkbox state automatically.

```ts
interface EditorChangePayload {
  event: { target: { type: string; checked?: boolean; value: string } }
  name: string
}
```

## `DragResult`

The result object from `@hello-pangea/dnd`'s `onDragEnd` callback.

```ts
interface DragResult {
  draggableId: string
  source: { droppableId: string; index: number }
  destination?: { droppableId: string; index: number } | null
}
```

## Full export list

See the sidebars for the complete public API covering hooks, layout primitives, display components, atom components, and editor primitives.
