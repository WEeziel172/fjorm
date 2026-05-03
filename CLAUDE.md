# CLAUDE.md

fjorm is a modular, drag-and-drop form builder library for React 19+. MIT licensed.

## Build & Development

```bash
npm run build          # tsup — ESM + CJS + DTS to dist/
npm run dev            # tsup --watch
npm test               # vitest run (jsdom, ~120 tests)
npm run test:watch     # vitest watch mode
npm run lint           # eslint src/ tests/
npm run format         # prettier --write 'src/**/*.{ts,tsx,css}' 'tests/**/*.{ts,tsx}'
```

Demo: `cd demo && npm install && npm run dev`
Website: `cd website && npm install && npm start`

## Architecture

**Adapter/Registry pattern.** A `Config` class holds `FormComponentRegistration` objects, each defining a form field type:

```ts
{ key, settings, icon, component, editor }
```

- `component` — rendered on the canvas and in preview
- `editor` — either a React component or a declarative `EditorFieldMap` object mapping setting keys to editor primitives (e.g. `{ label: 'EditorInput', required: 'EditorCheckbox' }`)

`EditorCompiler` converts `EditorFieldMap` objects into rendered editor components at runtime.

**Data flow:** `FormBuilder` → `useFormItems` hook manages state → `@hello-pangea/dnd` drives drag-and-drop → `applyDragEnd` handles add/reorder → `serializeFormItems` strips React-specific fields for JSON export.

## Source Structure (`src/`)

```
src/
  index.ts              — public API barrel (all exports)
  types.ts              — 14 TypeScript interfaces
  styles.css            — builder UI styles (CSS custom properties)

  utils/
    config.ts           — Config class (component registry)
    useDragDrop.ts      — useDragDrop hook + applyDragEnd
    useEditorChange.ts  — single useEditorChange hook
    useEditorState.ts   — local editor state hook
    useFormItems.ts     — useFormItems + serialization
    useOptionsManager.ts — option CRUD hook
    getSetting.ts       — type-safe settings access helper

  components/
    builderComponents.ts — default registrations (Header, Paragraph, TextInput, SelectInput)
    atoms/               — smallest primitives (Tag, Option, ToolboxItem, FormItemLabel, ErrorBoundary, etc.)
    molecules/           — composed atoms (EditorInput, EditorCheckbox, EditorOptions, ComponentEditActions, etc.)
    organisms/           — business-logic components (FormBuilder, FormDisplay, FormContainer, ToolBox, EditorToolBox, etc.)
    componentUtils/      — editorCompiler.tsx
```

## Code Style

- **Prettier:** no semicolons, single quotes, trailing commas, printWidth 100
- **ESLint:** flat config with typescript-eslint, react (jsx-runtime), react-hooks, jsx-a11y, prettier
- **TypeScript:** strict mode, ES2020 target, bundler resolution, JSX react-jsx
- Import order is not enforced. Organize imports as you find them.
- Default to no comments.

## Testing

- **vitest** with jsdom environment, globals enabled
- `@testing-library/react` for rendering, `@testing-library/user-event` for interactions
- Tests live in `tests/unit/` mirroring the `src/` structure
- Setup: `tests/setup.ts` loads `@testing-library/jest-dom/vitest` matchers
- Test files use `.test.ts` or `.test.tsx` extension

## Public API

Main entry: `src/index.ts`. Everything consumed by users must be exported here.

Key exports: `Config`, `FormBuilder`, `FormDisplay`, `FormContainer`, `ToolBox`, `EditorToolBox`, `EditorContainer`, `FormComponentWrapper`, `EditorInput`, `EditorCheckbox`, `EditorTextArea`, `EditorOptions`, `EditorCompiler`, `FormComponentInput`, `FormComponentSelect`, `FormComponentHeader`, `FormComponentParagraph`, `ErrorBoundary`, `FormComponentEditorContainer`, `FormItemLabel`, `FormItemDisplay`, `ComponentEditActions`, `Tag`, `Option`, `ToolboxItem`, `getSetting`, `formComponents`, hooks (`useEditorChange`, `useFormItems`, `useDragDrop`, `useEditorState`, `useOptionsManager`), serialization (`serializeFormItems`, `deserializeFormItems`, `applyDragEnd`), and all types.

## Peer Dependencies

- `react` ^19.0.0
- `react-dom` ^19.0.0

Runtime deps: `@hello-pangea/dnd` (drag-and-drop), `react-icons`, `uuid`.

## CI/CD

- **ci.yml:** typecheck → test → build → release (semantic-release on main, publishes to npm)
- **deploy-docs.yml:** builds root package, website (Docusaurus), and demo (Vite), copies demo into website, deploys via `peaceiris/actions-gh-pages`
- Semantic-release runs on every push to main. Commit messages follow conventional commits (`feat:`, `fix:`, `chore:`).

## Website & Demo

- Docusaurus 3 site at `website/`, served at `https://WEeziel172.github.io/fjorm/`
- Vite + React 19 demo at `demo/`, built and copied into `website/build/demo/` during deploy
- Demo depends on root `fjorm` package via `file:..` — root must be built first
- Demo Vite base is `/fjorm/demo/`

## Example Apps

Three UI library integrations in `examples/`:
- `antd/` — Ant Design v5 (React 19)
- `mantine/` — Mantine v7 (10+ field types)
- `mui/` — Material UI v5

Each has its own package.json referencing `fjorm: "file:../.."`.
