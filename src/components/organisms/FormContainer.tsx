import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { RecursiveItem } from './FormComponentContainer'
import type { FormItem } from '../../types'

const CANVAS_DROPPABLE_ID = 'fjorm-canvas'
const PLACEHOLDER_ID = '__fjorm-drag-placeholder__'

interface PlaceholderItem {
  id: string
  _isPlaceholder: true
}

function isPlaceholder(item: FormItem | PlaceholderItem): item is PlaceholderItem {
  return '_isPlaceholder' in item
}

function DropIndicator() {
  return (
    <div
      style={{
        height: '3px',
        background: 'var(--fj-color-primary, #5B6EFF)',
        borderRadius: '2px',
        margin: '2px 0',
        boxShadow: '0 0 4px rgba(91, 110, 255, 0.4)',
      }}
    />
  )
}

export function FormContainer({
  formItems,
  onDeleteFormItem,
  onEditFormItem,
  activeToolboxDragKey,
  dropInsertIndex,
}: {
  formItems: FormItem[]
  onDeleteFormItem: (payload: { id: string }) => void
  onEditFormItem: (payload: { id: string }) => void
  activeToolboxDragKey?: string | null
  dropInsertIndex?: number | null
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: CANVAS_DROPPABLE_ID,
    data: { kind: 'canvas-root' },
  })

  const displayItems = useMemo(() => {
    if (!activeToolboxDragKey || dropInsertIndex == null) return formItems

    const placeholder: PlaceholderItem = { _isPlaceholder: true, id: PLACEHOLDER_ID }
    const result: (FormItem | PlaceholderItem)[] = [...formItems]
    result.splice(dropInsertIndex, 0, placeholder)
    return result
  }, [formItems, activeToolboxDragKey, dropInsertIndex])

  // SortableContext only includes real form item IDs — the placeholder is a pure visual
  const itemIds = useMemo(() => formItems.map((item) => item.id), [formItems])

  return (
    <div className="form-container" role="region" aria-label="Form builder canvas" style={{ overflow: 'visible' }}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1.5rem',
            overflow: 'auto',
            background: isOver ? 'rgba(91, 110, 255, 0.04)' : undefined,
            outline: isOver ? '2px dashed var(--fj-color-drop-indicator)' : undefined,
          }}
        >
          {displayItems.length === 0 && (
            <div className="form-container-empty" aria-live="polite">
              Drag components here to build your form
            </div>
          )}
          {displayItems.length > 0 &&
            displayItems.map((item, index) => {
              if (isPlaceholder(item)) return <DropIndicator key={PLACEHOLDER_ID} />
              return (
                <RecursiveItem
                  key={item.id}
                  item={item}
                  index={index}
                  onEditFormItem={onEditFormItem}
                  onDeleteFormItem={onDeleteFormItem}
                />
              )
            })}
        </div>
      </SortableContext>
    </div>
  )
}
