import { useState, useImperativeHandle, useCallback, useRef, useEffect, forwardRef, useId } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { FormDisplay } from './FormDisplay'
import { FormContainer } from './FormContainer'
import { EditorToolBox } from './editorToolBox'
import { ToolBox } from './ToolBox'
import { useFormItems, serializeFormItems } from '../../utils/useFormItems'
import { useDragDrop, applyDragEnd } from '../../utils/useDragDrop'
import type { Config } from '../../utils/config'
import type { FormItem, SerializedFormItem, FormConfig, DragResult, FormBuilderHandle } from '../../types'

export interface FormBuilderProps {
  config: Config
  form?: FormConfig
  initialData?: SerializedFormItem[]
  onChange?: (data: SerializedFormItem[]) => void
  onSubmit?: (data: Record<string, unknown>) => void
}

const FormBuilder = forwardRef<FormBuilderHandle, FormBuilderProps>(function FormBuilder(
  { config, form, initialData, onChange, onSubmit }: FormBuilderProps,
  ref,
) {
  const [currentEditor, setCurrentEditor] = useState<FormItem | null>(null)
  const [previewForm, setPreviewForm] = useState(false)

  const {
    formItems,
    setFormItems,
    deleteItem,
    findItem,
    changeSettings,
    changeOptions,
    addItem,
    reorderItems,
  } = useFormItems(config, initialData, onChange)

  const formItemsRef = useRef(formItems)
  useEffect(() => { formItemsRef.current = formItems }, [formItems])

  const formContainerRef = useRef<HTMLDivElement | null>(null)
  const toolboxDroppableId = useId()
  const canvasDroppableId = useId()

  const { placeholderProps, onDragUpdate } = useDragDrop(formContainerRef)

  const onContainerMount = useCallback(
    (element: HTMLDivElement | null) => {
      formContainerRef.current = element
    },
    [],
  )

  useImperativeHandle(ref, () => ({
    getFormItems: () => serializeFormItems(formItemsRef.current),
    reset: () => {
      setCurrentEditor(null)
      setPreviewForm(false)
      setFormItems([])
      onChange?.([])
    },
  }), [formItemsRef, setFormItems, onChange])

  const currentEditorIdRef = useRef<string | undefined>(undefined)
  const editorPanelRef = useRef<HTMLDivElement>(null)

  // Keep ref in sync with currentEditor for stable callback references
  useEffect(() => {
    currentEditorIdRef.current = currentEditor?.id
    if (currentEditor) {
      const rafId = requestAnimationFrame(() => {
        editorPanelRef.current
          ?.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
          ?.focus()
      })
      return () => cancelAnimationFrame(rafId)
    }
  }, [currentEditor])

  // Clear currentEditor if the edited item was removed from formItems
  useEffect(() => {
    setCurrentEditor((prev) => {
      if (prev && !formItems.some((item) => item.id === prev.id)) {
        return null
      }
      return prev
    })
  }, [formItems])

  const onDeleteFormItem = useCallback(
    ({ id }: { id: string }) => {
      if (currentEditorIdRef.current === id) setCurrentEditor(null)
      deleteItem(id)
    },
    [deleteItem],
  )

  const onEditFormItem = useCallback(
    ({ id }: { id: string }) => {
      const item = findItem(id)
      if (item) setCurrentEditor(item)
    },
    [findItem],
  )

  const onChangeFormItemSettings = useCallback(
    ({ id, settings }: { id: string; settings: FormItem['settings'] }) => {
      changeSettings(id, settings)
    },
    [changeSettings],
  )

  const onChangeFormItemOptions = useCallback(
    ({ id, options }: { id: string; options: FormItem['options'] }) => {
      if (options !== undefined) changeOptions(id, options)
    },
    [changeOptions],
  )

  const onDragEnd = useCallback(
    (d: DragResult) => {
      applyDragEnd(d, addItem, reorderItems, { sourceDroppableId: toolboxDroppableId })
    },
    [addItem, reorderItems, toolboxDroppableId],
  )

  return (
    <div className="fjorm form-builder-container">
      <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        {previewForm && (
          <FormDisplay
            form={form}
            config={config}
            data={serializeFormItems(formItems)}
            onSubmit={onSubmit}
          />
        )}
        {!previewForm && (
          <FormContainer
            placeholderProps={placeholderProps}
            formItems={formItems}
            onEditFormItem={onEditFormItem}
            onDeleteFormItem={onDeleteFormItem}
            onContainerMount={onContainerMount}
            droppableId={canvasDroppableId}
          />
        )}

        {!currentEditor && (
          <ToolBox
            previewForm={previewForm}
            setPreviewForm={setPreviewForm}
            formComponents={config.components}
            droppableId={toolboxDroppableId}
          />
        )}
        {currentEditor && (
          <div ref={editorPanelRef}>
            <EditorToolBox
              key={currentEditor.id}
              onClose={() => setCurrentEditor(null)}
              onChangeFormItemOptions={onChangeFormItemOptions}
              onChangeFormItemSettings={onChangeFormItemSettings}
              currentEditor={currentEditor}
            />
          </div>
        )}
      </DragDropContext>
    </div>
  )
})
export default FormBuilder
