import { EditorContainer } from './editorContainer'
import type { FormItem, FormComponentSettings, FormComponentOption } from '../../types'

export function EditorToolBox({
  onChangeFormItemSettings,
  onChangeFormItemOptions,
  currentEditor,
  onClose,
}: {
  onChangeFormItemSettings: (payload: { id: string; settings: FormComponentSettings }) => void
  onChangeFormItemOptions: (payload: { id: string; options: FormComponentOption[] }) => void
  currentEditor: FormItem
  onClose: () => void
}) {
  const Icon = currentEditor.icon

  return (
    <div className="toolbox-container editor-panel">
      <div className="editor-panel-header">
        <button className="editor-panel-back" onClick={onClose} aria-label="Back to components">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="editor-panel-icon">
          {Icon && <Icon />}
        </div>
        <div className="editor-panel-title">
          <span className="editor-panel-label">Editing</span>
          <span className="editor-panel-name">{currentEditor.settings.label}</span>
        </div>
      </div>

      <div className="editor-panel-body">
        <EditorContainer
          formItemId={currentEditor.id}
          editor={currentEditor.editor}
          settings={currentEditor.settings}
          options={currentEditor.options}
          onChangeFormItemOptions={onChangeFormItemOptions}
          onChangeFormItemSettings={onChangeFormItemSettings}
        />
      </div>

      <div className="editor-panel-footer">
        <button className="toolbox-item--save-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}
