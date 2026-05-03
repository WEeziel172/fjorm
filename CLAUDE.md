# CLAUDE.md

fjorm is a modular, drag-and-drop form builder library for React 19+. MIT licensed.

## Build & Development

```bash
yarn build          # tsup — ESM + CJS + DTS to dist/
yarn dev            # tsup --watch
yarn test           # vitest run (jsdom, ~120 tests)
yarn test:watch     # vitest watch mode
yarn lint           # eslint src/ tests/
yarn format         # prettier --write 'src/**/*.{ts,tsx,css}' 'tests/**/*.{ts,tsx}'
```

Demo: `cd demo && yarn install && yarn dev`
Website: `cd website && yarn install && yarn start`

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

Runtime deps: `@hello-pangea/dnd` (drag-and-drop), `uuid`.

## CI/CD

- **ci.yml:** typecheck → test → build → release (semantic-release on main, publishes to npm)
- **deploy-docs.yml:** builds root package, website (Docusaurus), and demo (Vite), copies demo into website, deploys via `peaceiris/actions-gh-pages`
- Semantic-release runs on every push to main. Commit messages follow conventional commits.
- **Only `feat:` and `fix:` trigger npm releases.** Use `ci:` (workflows), `chore:` (repo config, deps), `docs:` (website, readme), or `test:` for changes that don't affect the published package. If the PR is purely repo-level changes, squash-merge it with a `ci:` or `chore:` commit message to avoid an unnecessary release.

## Website & Demo

- Docusaurus 3 site at `website/`, served at `https://WEeziel172.github.io/fjorm/`
- Vite + React 19 demo at `demo/`, built and copied into `website/build/demo/` during deploy
- Demo depends on root `fjorm` package via `file:..` — root must be built first
- Demo Vite base is `/fjorm/demo/`

## Example Apps

Three UI library integrations in `examples/`:
- `antd/` — Ant Design v6 (React 19)
- `mantine/` — Mantine v9 (10+ field types)
- `mui/` — Material UI v9

Each has its own package.json referencing `fjorm: "file:../.."`.
