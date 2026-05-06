---
sidebar_position: 6
---

# Layout Primitives

The five components that `FormBuilder` composes for its layout. Use these directly to build a custom builder with a different arrangement.

## `FormContainer`

The drag-and-drop canvas where form items are placed. Uses `useDroppable` for the root canvas target and `SortableContext` for item reordering.

```tsx
<FormContainer
  formItems={formItems}
  onDeleteFormItem={({ id }) => {}}
  onEditFormItem={({ id }) => {}}
/>
```

| Prop | Type | Description |
|---|---|---|
| `formItems` | `FormItem[]` | Items to render on the canvas |
| `onDeleteFormItem` | `(payload: { id: string }) => void` | Called when delete action clicked |
| `onEditFormItem` | `(payload: { id: string }) => void` | Called when edit action clicked |
| `activeToolboxDragKey` | `string \| null` | Currently dragged toolbox key — enables drop indicator |
| `dropInsertIndex` | `number \| null` | Target insertion index for the drop indicator |

Must be rendered inside a `DndContext`. Each form item uses `useSortable` for reordering.

---

## `ToolBox`

The component palette — shows available field types that can be dragged onto the canvas. Each item uses `useDraggable`.

```tsx
<ToolBox
  formComponents={config.components}
  previewForm={isPreview}
  setPreviewForm={setPreview}
  activeDragKey={activeId}
/>
```

| Prop | Type | Description |
|---|---|---|
| `formComponents` | `FormComponentRegistration[]` | Components to display in the palette |
| `previewForm` | `boolean` | Whether preview mode is active |
| `setPreviewForm` | `(preview: boolean) => void` | Toggle preview mode |
| `activeDragKey` | `string \| null` | Currently dragged component key for dimming |

Must be rendered inside a `DndContext`.

---

## `EditorToolBox`

The editor sidebar panel. Shows when a form item is selected for editing.

```tsx
<EditorToolBox
  currentEditor={currentEditor}
  onChangeFormItemSettings={({ id, settings }) => {}}
  onChangeFormItemOptions={({ id, options }) => {}}
  onClose={() => setCurrentEditor(null)}
/>
```

| Prop | Type | Description |
|---|---|---|
| `currentEditor` | `FormItem` | The form item being edited |
| `onChangeFormItemSettings` | `(payload) => void` | Called when a setting changes |
| `onChangeFormItemOptions` | `(payload) => void` | Called when options change |
| `onClose` | `() => void` | Called when the editor is dismissed |

---

## `EditorContainer`

Renders the actual editor fields for a form item. Delegates to either a custom editor component or `EditorCompiler` for declarative editor objects.

```tsx
<EditorContainer
  formItemId={id}
  editor={editor}
  settings={settings}
  options={options}
  onChangeFormItemSettings={({ id, settings }) => {}}
  onChangeFormItemOptions={({ id, options }) => {}}
/>
```

| Prop | Type | Description |
|---|---|---|
| `formItemId` | `string` | ID of the item being edited |
| `editor` | `EditorDefinition` | Component or declarative object |
| `settings` | `FormComponentSettings` | Current settings |
| `options` | `FormComponentOption[]` | Current options |
| `onChangeFormItemSettings` | `(payload) => void` | Settings change callback |
| `onChangeFormItemOptions` | `(payload) => void` | Options change callback |

---

## `FormComponentWrapper`

Wraps a single form item on the canvas with edit/delete action buttons. Used internally by `FormContainer`.

```tsx
<FormComponentWrapper id={item.id} onEdit={handleEdit} onDelete={handleDelete}>
  <MyComponent {...props} />
</FormComponentWrapper>
```

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | Form item ID |
| `onEdit` | `(payload: { id: string }) => void` | Edit callback |
| `onDelete` | `(payload: { id: string }) => void` | Delete callback |
| `children` | `ReactNode` | The display component |
