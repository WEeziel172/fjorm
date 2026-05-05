---
sidebar_position: 1
---

# Config

The central component registry. Register form component definitions here.

```ts
class Config {
  get components(): FormComponentRegistration[]
  getComponent(key: string): FormComponentRegistration | undefined
  addComponents(arr: readonly FormComponentRegistration[]): void
}
```

## `addComponents(arr)`

Registers an array of form component definitions. Building the internal lookup index for O(1) access by key. Warns on duplicate keys.

```ts
const config = new Config()
config.addComponents([
  {
    key: 'TextInput',
    settings: { label: 'Text input', name: 'TextInput' },
    icon: FaFont,
    component: MyTextInput,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput' },
  },
])
```

## `getComponent(key)`

Looks up a registered component by key. Returns `undefined` if not found.

```ts
const textInput = config.getComponent('TextInput')
// { key: 'TextInput', settings: {...}, icon: ..., component: ..., editor: ... }
```

## `get components()`

Returns the full array of registered components. Read-only from outside the class — use `addComponents` to mutate.

## `FormComponentRegistration`

Each registered field type follows this shape:

```ts
interface FormComponentRegistration<
  TSettings extends FormComponentSettings = FormComponentSettings
> {
  key: string
  settings: TSettings
  icon?: ComponentType
  component: ComponentType<FormComponentProps>
  editor: EditorDefinition
  options?: FormComponentOption[]
  providesValue?: boolean
  isContainer?: boolean
}
```

### Editor modes

**Declarative** — map field names to editor types. `EditorCompiler` renders the matching primitives.

```ts
editor: { label: 'EditorInput', required: 'EditorCheckbox', options: 'EditorOptions' }
```

**Custom component** — pass any React component receiving `EditorProps`. Full control over layout and behavior.

```ts
editor: MyCustomEditorComponent
```
