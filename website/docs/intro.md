---
sidebar_position: 1
---

# Fjorm

Modular drag-and-drop form builder for React — bring your own components.

Fjorm lets you build visual, drag-and-drop form editors in React. Drag components from a toolbox onto a canvas, configure each field's properties in a sidebar editor, preview the live form, and serialize the result as JSON. The rendering layer is completely pluggable — use raw HTML inputs, Ant Design, MUI, Mantine, or your own design system.

## Features

- **Visual form builder** — drag components from a palette onto a canvas
- **Inline property editing** — edit labels, placeholders, required flags, select options
- **Preview mode** — toggle between builder and rendered-form views
- **UI-framework agnostic** — register your own display components per field type
- **JSON serialization** — export/import form structure as portable JSON
- **TypeScript-first** — full type definitions for all APIs
- **Lightweight** — peer-deps only: React 19+ and react-dom 19+; runtime deps: `@hello-pangea/dnd`, `react-icons`, `uuid`

## Install

```bash
npm install fjorm react react-dom
```

## Quick Start

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

This gives you a working drag-and-drop form builder with four built-in field types: Header, Paragraph, TextInput, and SelectInput.

## Project Structure

```
fjorm/
├── src/                  # library source
│   ├── index.ts          # public API barrel
│   ├── types.ts          # TypeScript definitions
│   ├── styles.css        # builder UI styles
│   ├── utils/            # Config class, hooks
│   └── components/       # atoms, molecules, organisms
├── website/              # Docusaurus docs site
├── demo/                 # Vite + React demo app
├── examples/
│   ├── antd/             # Ant Design v5
│   ├── mui/              # Material UI v5
│   └── mantine/          # Mantine v7
└── .github/workflows/    # CI/CD
```
