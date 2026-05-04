import { useState, useImperativeHandle, useCallback, useRef, useEffect, forwardRef, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  type CollisionDetection,
} from '@dnd-kit/core'
import { FormDisplay } from './FormDisplay'
import { FormContainer } from './FormContainer'
import { EditorToolBox } from './editorToolBox'
import { ToolBox } from './ToolBox'
import { ToolboxItem } from '../atoms/toolboxItem'
import { useFormItems, serializeFormItems } from '../../utils/useFormItems'
import { useFormBuilderDragDrop } from '../../utils/useDragDrop'
import type { Config } from '../../utils/config'
import type { FormItem, SerializedFormItem, FormConfig, FormBuilderHandle } from '../../types'

const customCollisionDetection: CollisionDetection = (args) => {
  const closest = closestCorners(args)
  const pointer = pointerWithin(args)

  // Container dropzones get priority — they must win over the container's
  // own sortable wrapper so items can be dropped INTO containers.
  const containers = pointer.filter((c) => {
    const dc = args.droppableContainers.find((d) => d.id === c.id)
    const kind = (dc?.data?.current as { kind?: string } | undefined)?.kind
    return kind === 'container-dropzone'
  })
  // Canvas root as fallback.
  const canvas = pointer.filter((c) => {
    const dc = args.droppableContainers.find((d) => d.id === c.id)
    const kind = (dc?.data?.current as { kind?: string } | undefined)?.kind
    return kind === 'canvas-root'
  })

  return [...containers, ...closest, ...canvas]
}

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
    moveItem,
  } = useFormItems(config, initialData, onChange)

  const formItemsRef = useRef(formItems)
  useEffect(() => { formItemsRef.current = formItems }, [formItems])

  const getItemIndex = useCallback(
    (id: string, parentId?: string) => {
      if (parentId) {
        const parent = findItem(parentId)
        return parent?.children?.findIndex((c) => c.id === id) ?? -1
      }
      return formItemsRef.current.findIndex((item) => item.id === id)
    },
    [findItem],
  )

  const getParentId = useCallback(
    (id: string): string | undefined => {
      for (const item of formItemsRef.current) {
        if (item.children?.some((c) => c.id === id)) return item.id
      }
      return undefined
    },
    [],
  )

  const getRootItemCount = useCallback(
    () => formItemsRef.current.length,
    [],
  )

  const { activeId, onDragStart, onDragEnd } = useFormBuilderDragDrop(
    addItem,
    reorderItems,
    moveItem,
    getItemIndex,
    getParentId,
    getRootItemCount,
  )

  const toolboxKeys = useMemo(
    () => new Set(config.components.map((c) => c.key)),
    [config.components],
  )

  const activeComponentKey = activeId && toolboxKeys.has(activeId) ? activeId : null
  const draggedFormItem = activeId && !toolboxKeys.has(activeId) ? findItem(activeId) : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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

  useEffect(() => {
    setCurrentEditor((prev) => {
      if (prev && !findItem(prev.id)) {
        return null
      }
      return prev
    })
  }, [formItems, findItem])

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

  return (
    <div className="fjorm form-builder-container">
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
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
            formItems={formItems}
            onEditFormItem={onEditFormItem}
            onDeleteFormItem={onDeleteFormItem}
          />
        )}

        {!currentEditor && (
          <ToolBox
            previewForm={previewForm}
            setPreviewForm={setPreviewForm}
            formComponents={config.components}
            activeDragKey={activeId}
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

        <DragOverlay dropAnimation={null}>
          {activeComponentKey && (() => {
            const c = config.getComponent(activeComponentKey)
            if (!c) return null
            return (
              <div style={{ opacity: 0.92, cursor: 'grabbing', transform: 'rotate(2deg)' }}>
                <ToolboxItem icon={c.icon} name={c.settings.label} />
              </div>
            )
          })()}
          {draggedFormItem && (
            <div style={{ opacity: 0.85, cursor: 'grabbing' }}>
              <draggedFormItem.component
                settings={draggedFormItem.settings}
                label={draggedFormItem.settings.label}
                id="drag-overlay"
                options={draggedFormItem.options}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
})
export default FormBuilder
