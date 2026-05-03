---
sidebar_position: 4
---

# Examples

Ready-to-run example apps demonstrating Fjorm with three major React component libraries.

## Live Demos

| Example | Live |
|---|---|
| Basic Demo | [weeziel172.github.io/fjorm/demo/](https://weeziel172.github.io/fjorm/demo/) |
| Ant Design v5 | [weeziel172.github.io/fjorm/examples/antd/](https://weeziel172.github.io/fjorm/examples/antd/) |
| Material UI v5 | [weeziel172.github.io/fjorm/examples/mui/](https://weeziel172.github.io/fjorm/examples/mui/) |
| Mantine v7 | [weeziel172.github.io/fjorm/examples/mantine/](https://weeziel172.github.io/fjorm/examples/mantine/) |

## Run Locally

```bash
git clone https://github.com/WEeziel172/fjorm
cd fjorm

# Basic demo
cd demo && npm install && npm run dev

# Ant Design v5
cd examples/antd && npm install && npm run dev

# Material UI v5
cd examples/mui && npm install && npm run dev

# Mantine v7
cd examples/mantine && npm install && npm run dev
```

Each example includes:

- A `FormWrapper` component that integrates with the library's form system
- Several field types (Text input, Text area, Number, Select, Checkbox, etc.)
- Editor definitions for each field type
- A working Vite dev server
