---
sidebar_position: 7
---

# Built-in Display Components

The four default field components used by `formComponents`. Export them to reference in custom registrations or extend them.

## `FormComponentInput`

Renders a text input field.

```tsx
<FormComponentInput
  id="1"
  label="Email"
  settings={{ label: 'Email', name: 'email', required: true, placeholder: 'Enter email' }}
  value="prefilled@test.com"
/>
```

Renders: a `<label>` with required badge (if applicable), and a `<input type="text">` with the settings applied.

---

## `FormComponentSelect`

Renders a select dropdown.

```tsx
<FormComponentSelect
  id="2"
  label="Role"
  settings={{ label: 'Role', name: 'role', required: true }}
  options={[{ id: 'a', title: 'Admin', value: 'admin' }]}
  value="admin"
/>
```

Renders: a `<label>` with required badge, and a `<select>` with `<option>` elements from `options`.

---

## `FormComponentHeader`

Renders a heading element. Accepts an optional `headingLevel` prop to control the HTML heading tag.

```tsx
<FormComponentHeader
  id="3"
  label="Section Title"
  settings={{ label: 'Section Title', name: 'header' }}
  headingLevel="h2"
/>
```

| Prop | Type | Description |
|---|---|---|
| `headingLevel` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | Heading tag to render (optional, defaults to `'h3'`) |

Renders: a styled heading.

---

## `FormComponentParagraph`

Renders a paragraph block.

```tsx
<FormComponentParagraph
  id="4"
  settings={{ label: 'Note', content: 'Some text', name: 'paragraph' }}
/>
```

Renders: the `content` from settings as formatted text.

---

All four components accept the full `FormComponentProps` interface, including `onChangeValue`, `style`, `children`, and `editMode`.
