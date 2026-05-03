---
sidebar_position: 8
---

# Atom Components

Small, reusable UI primitives. Used internally by layout and editor components, but exported for custom UI composition.

## `FormItemLabel`

A form field label with an optional "Required" badge.

```tsx
<FormItemLabel label="Email" required={true} />
```

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Label text |
| `required` | `boolean` | Show the Required badge |

---

## `FormItemDisplay`

A layout wrapper that stacks a label above a form control.

```tsx
<FormItemDisplay>
  <FormItemLabel label="Email" required />
  <input type="text" name="email" />
</FormItemDisplay>
```

Purely a `<div>` layout wrapper — applies flex column styling.

---

## `Tag`

A small badge. Used for the "Required" indicator.

```tsx
<Tag>Required</Tag>
```

Renders an inline pill-shaped badge with warning colors.

---

## `Option`

A single option row — two text inputs (value + title) and a delete button. Used by `EditorOptions`.

```tsx
<Option
  id="opt-1"
  value="admin"
  title="Administrator"
  onChange={({ id, event, name }) => {}}
  onDelete={({ id }) => {}}
/>
```

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Option ID |
| `value` | `string` | Option value (submitted) |
| `title` | `string` | Option display title |
| `onChange` | `(payload: OnChangePayload) => void` | Called when value or title changes |
| `onDelete` | `(payload: { id: string }) => void` | Called when delete is clicked |

---

## `ToolboxItem`

A single card in the toolbox palette. Shows an icon and label.

```tsx
<ToolboxItem icon={FaFont} name="Text input" style={{ width: 'initial' }} />
```

| Prop | Type | Description |
|---|---|---|
| `icon` | `ComponentType` | Icon component to render |
| `name` | `string` | Display name |
| `style` | `CSSProperties` | Optional style overrides |

---

## `ComponentEditActions`

Edit and delete action buttons that appear on hover over a form item on the canvas.

```tsx
<ComponentEditActions id={item.id} onEdit={handleEdit} onDelete={handleDelete} />
```

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Form item ID (required, used for callbacks) |
| `onEdit` | `(payload: { id: string }) => void` | Edit callback |
| `onDelete` | `(payload: { id: string }) => void` | Delete callback |
