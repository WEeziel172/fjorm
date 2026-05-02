import './styles.css'

// --- Class ---
export { Config } from './utils/config'

// --- Hooks ---
export { useEditorChange } from './utils/useEditorChange'
export { useFormItems, serializeFormItems, deserializeFormItems } from './utils/useFormItems'
export { useDragDrop, applyDragEnd } from './utils/useDragDrop'
export { useEditorState } from './utils/useEditorState'
export { useOptionsManager } from './utils/useOptionsManager'

// --- Main components ---
export { default as FormBuilder } from './components/organisms/FormBuilder'
export { FormDisplay } from './components/organisms/FormDisplay'

// --- Layout primitives (for custom builders) ---
export { FormContainer } from './components/organisms/FormContainer'
export { ToolBox } from './components/organisms/ToolBox'
export { EditorToolBox } from './components/organisms/editorToolBox'
export { EditorContainer } from './components/organisms/editorContainer'
export { FormComponentWrapper } from './components/organisms/formComponentWrapper'

// --- Editor primitives ---
export { EditorInput } from './components/molecules/editorInput'
export { EditorCheckbox } from './components/molecules/editorCheckbox'
export { EditorTextArea } from './components/molecules/editorTextArea'
export { EditorOptions } from './components/molecules/editorOptions'
export { EditorCompiler } from './components/componentUtils/editorCompiler'

// --- Display primitives (for custom form fields) ---
export { FormComponentInput } from './components/organisms/formComponentInput'
export { FormComponentSelect } from './components/organisms/formComponentSelect'
export { FormComponentHeader } from './components/atoms/formComponentHeader'
export { FormComponentParagraph } from './components/molecules/formComponentParagraph'

// --- Atom components ---
export { ErrorBoundary } from './components/atoms/errorBoundary'
export { FormComponentEditorContainer } from './components/atoms/formComponentEditorContainer'
export { FormItemLabel } from './components/atoms/formItemLabel'
export { FormItemDisplay } from './components/atoms/formItemDisplay'
export { ComponentEditActions } from './components/molecules/componentEditActions'
export { Tag } from './components/atoms/tag'
export { Option } from './components/atoms/option'
export { ToolboxItem } from './components/atoms/toolboxItem'

// --- Utilities ---
export { getSetting } from './utils/getSetting'

// --- Default component definitions ---
export { formComponents } from './components/builderComponents'

// --- Types ---
export type {
  FormComponentSettings,
  FormComponentOption,
  EditorProps,
  FormComponentProps,
  EditorDefinition,
  EditorFieldMap,
  FormComponentRegistration,
  FormItem,
  SerializedFormItem,
  FormConfigProps,
  FormConfig,
  EditorChangePayload,
  DragResult,
  FormBuilderHandle,
} from './types'
