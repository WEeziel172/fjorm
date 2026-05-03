---
sidebar_position: 4
---

# Examples

Ready-to-run example apps demonstrating Fjorm with three major React component libraries, plus a comprehensive custom example.

## Live Demos

| Example | Live |
|---|---|
| Basic Demo | [fjorm playground](https://weeziel172.github.io/fjorm/demo/) |
| Ant Design v6 | [fjorm playground](https://weeziel172.github.io/fjorm/demo/#/antd) |
| Mantine v9 | [fjorm playground](https://weeziel172.github.io/fjorm/demo/#/mantine) |
| Material UI v9 | [fjorm playground](https://weeziel172.github.io/fjorm/demo/#/mui) |
| Custom Example | [fjorm playground](https://weeziel172.github.io/fjorm/demo/#/custom) |

## Run Locally

```bash
git clone https://github.com/WEeziel172/fjorm
cd fjorm

# Start the playground (includes all examples)
cd demo && yarn install && yarn dev
```

## What's Included

**Basic Demo** — Default fjorm form components with the pre-built FormBuilder.

**UI Library Examples** — Each demonstrates integrating fjorm with a major React component library:
- A `FormWrapper` component that integrates with the library's form system
- 10 field types (Text input, Text area, Number, Select, Checkbox, Radio group, Date picker, Switch, Header, Paragraph)
- Declarative editor definitions for each field type
- Build/Preview toggle with submitted data viewer

**Custom Example** — Demonstrates building a form builder and display from fjorm's primitives:
- Custom field types built from scratch (Slider, TagInput, ColorPicker, Divider, Rating)
- Manual composition of `ToolBox` + `FormContainer` + `EditorToolBox`
- JSON export/import via `serializeFormItems` / `deserializeFormItems`
- `useFormItems`, `useDragDrop`, `applyDragEnd` for state and DnD
- Custom editor component implementing `EditorProps`
- `ErrorBoundary`, `FormComponentEditorContainer`, `useEditorChange` in practice
- localStorage autosave
