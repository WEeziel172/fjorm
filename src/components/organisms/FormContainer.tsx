import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { RecursiveItem } from './FormComponentContainer'
import type { FormItem } from '../../types'

const CANVAS_DROPPABLE_ID = 'fjorm-canvas'

export function FormContainer({
  formItems,
  onDeleteFormItem,
  onEditFormItem,
}: {
  formItems: FormItem[]
  onDeleteFormItem: (payload: { id: string }) => void
  onEditFormItem: (payload: { id: string }) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: CANVAS_DROPPABLE_ID,
    data: { kind: 'canvas-root' },
  })

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
          {formItems.length === 0 && (
            <div className="form-container-empty" aria-live="polite">
              Drag components here to build your form
            </div>
          )}
          {formItems.length > 0 &&
            formItems.map((item, index) => (
              <RecursiveItem
                key={item.id}
                item={item}
                index={index}
                onEditFormItem={onEditFormItem}
                onDeleteFormItem={onDeleteFormItem}
              />
            ))}
        </div>
      </SortableContext>
    </div>
  )
}
