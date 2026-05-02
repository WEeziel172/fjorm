---
sidebar_position: 4
---

# Examples

Ready-to-run example apps demonstrating Fjorm with three major React component libraries.

```bash
git clone https://github.com/WEeziel172/fjorm
cd fjorm

# Ant Design v5
cd examples/antd && npm install && npm run dev

# Material UI v5
cd examples/mui && npm install && npm run dev

# Mantine v7
cd examples/mantine && npm install && npm run dev
```

Each example includes:

- A `FormWrapper` component that integrates with the library's form system
- 8–12 field types (Text input, Text area, Number, Select, Checkbox, Radio group, Date picker, Switch, and a `ListSwitcher`)
- Editor definitions for each field type
- A working Vite dev server

## Demo

The `demo/` directory contains a minimal Vite app using the built-in `formComponents`:

```bash
cd demo && npm install && npm run dev
```
