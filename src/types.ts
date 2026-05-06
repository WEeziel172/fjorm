import type { ComponentType, CSSProperties, ReactNode } from 'react'

export interface FormComponentSettings {
  label: string
  name: string
  required?: boolean
  placeholder?: string
  content?: string
  [key: string]: unknown
}

export interface FormComponentOption {
  id: string
  title: string
  value: string
}

export interface EditorProps {
  settings: FormComponentSettings
  options?: FormComponentOption[]
  formItemId: string
  onValueChange: (payload: { name: string; value: unknown }) => void
  onChangeOptions?: (payload: { name: string; options: FormComponentOption[] }) => void
}

export interface FormComponentProps {
  id: string
  label: string
  style?: CSSProperties
  settings: FormComponentSettings
  options?: FormComponentOption[]
  children?: ReactNode
  editMode?: boolean
  value?: unknown
  onChangeValue?: (value: unknown) => void
  onChangeFormItemSettings?: (payload: { id: string; settings: FormComponentSettings }) => void
  onClick?: (payload: { id: string }) => void
  editor?: EditorDefinition
}

export interface EditorFieldDescriptor {
  type: string
  options?: { value: string; label: string }[]
}

export type EditorFieldMap = Record<string, string | EditorFieldDescriptor>

export type EditorDefinition =
  | ComponentType<EditorProps>
  | EditorFieldMap

export interface FormComponentRegistration<
  TSettings extends FormComponentSettings = FormComponentSettings,
> {
  key: string
  settings: TSettings
  icon?: ComponentType
  component: ComponentType<FormComponentProps>
  editor: EditorDefinition
  options?: FormComponentOption[]
  providesValue?: boolean
  /** When true, this item renders a nested droppable zone and passes children to the component. */
  isContainer?: boolean
}

export interface FormItem extends FormComponentRegistration {
  id: string
  value?: unknown
  children?: FormItem[]
}

export interface SerializedFormItem {
  id: string
  key: string
  settings: FormComponentSettings
  options?: FormComponentOption[]
  value?: unknown
  children?: SerializedFormItem[]
}

export interface FormConfigProps {
  children?: ReactNode
  onSubmit?: (data: Record<string, unknown>) => void
  fjormValues: Record<string, unknown>
}

export interface FormConfig {
  component: ComponentType<FormConfigProps>
  actions?: ReactNode
}

export interface EditorChangePayload {
  event: { target: { type: string; checked?: boolean; value: string } }
  name: string
}

/** Data attached to draggable/droppable elements via dnd-kit's `data` prop. */
export interface DndItemData {
  kind: 'toolbox-item' | 'canvas-item' | 'container-dropzone' | 'canvas-root' | 'drop-indicator'
  componentKey?: string
  containerId?: string
}

/** The active (dragged) item in a dnd-kit event. */
export interface DndActive {
  id: string
  data: { current: DndItemData | undefined }
}

/** The over (hover target) item in a dnd-kit event. */
export interface DndOver {
  id: string
  data: { current: DndItemData | undefined }
}

/** Shape passed to onDragEnd handler from dnd-kit's DragEndEvent. */
export interface DragEndPayload {
  active: DndActive
  over: DndOver
}

/** @deprecated Use DragEndPayload instead. */
export interface DragResult {
  draggableId: string
  source: { droppableId: string; index: number }
  destination?: { droppableId: string; index: number } | null
}

export interface FormBuilderHandle {
  getFormItems: () => SerializedFormItem[]
  reset: () => void
}
