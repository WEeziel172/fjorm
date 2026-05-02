import { useEditorState } from '../../utils/useEditorState'
import { EditorCompiler } from '../componentUtils/editorCompiler'
import { ErrorBoundary } from '../atoms/errorBoundary'
import type { FormComponentSettings, FormComponentOption, EditorDefinition } from '../../types'

export function EditorContainer({
  formItemId,
  editor,
  settings: currentSettings,
  options: currentOptions,
  onChangeFormItemSettings,
  onChangeFormItemOptions,
}: {
  formItemId: string
  editor: EditorDefinition
  settings: FormComponentSettings
  options?: FormComponentOption[]
  onChangeFormItemSettings: (payload: { id: string; settings: FormComponentSettings }) => void
  onChangeFormItemOptions: (payload: { id: string; options: FormComponentOption[] }) => void
}) {
  const { settings, options, handleOnChangeSettings, handleOnChangeOptions } =
    useEditorState(
      formItemId,
      currentSettings,
      currentOptions,
      onChangeFormItemSettings,
      onChangeFormItemOptions,
    )

  if (typeof editor === 'function') {
    const Editor = editor
    return (
      <ErrorBoundary key={formItemId}>
        <Editor
          options={options}
          formItemId={formItemId}
          onValueChange={handleOnChangeSettings}
          onChangeOptions={handleOnChangeOptions}
          settings={settings}
        />
      </ErrorBoundary>
    )
  }

  if (typeof editor === 'object') {
    return (
      <ErrorBoundary key={formItemId}>
        <EditorCompiler
          editor={editor}
          options={options}
          formItemId={formItemId}
          onValueChange={handleOnChangeSettings}
          onChangeOptions={handleOnChangeOptions}
          settings={settings}
        />
      </ErrorBoundary>
    )
  }

  return null
}
