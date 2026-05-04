import { useDraggable, useDroppable } from '@dnd-kit/core'
import { ToolboxItem } from '../atoms/toolboxItem'
import type { FormComponentRegistration } from '../../types'

const TOOLBOX_DROPPABLE_ID = 'fjorm-toolbox'

export function ToolBox({
  formComponents,
  setPreviewForm,
  previewForm,
  activeDragKey,
}: {
  formComponents: FormComponentRegistration[]
  setPreviewForm: (preview: boolean) => void
  previewForm: boolean
  activeDragKey: string | null
}) {
  const { setNodeRef } = useDroppable({ id: TOOLBOX_DROPPABLE_ID })

  return (
    <div className="toolbox-container">
      <h3>Components</h3>

      <div ref={setNodeRef} className="toolbox-list">
        {formComponents.map(({ key, icon, settings: { label } }) => (
          <ToolboxDraggableItem
            key={key}
            componentKey={key}
            icon={icon}
            label={label}
            isActive={activeDragKey === key}
          />
        ))}
      </div>

      <div className="toolbox-actions">
        <button
          className="toolbox-item--save-btn"
          onClick={() => setPreviewForm(!previewForm)}
        >
          {previewForm ? 'End preview' : 'Preview form'}
        </button>
      </div>
    </div>
  )
}

function ToolboxDraggableItem({
  componentKey,
  icon: Icon,
  label,
  isActive,
}: {
  componentKey: string
  icon?: React.ComponentType
  label: string
  isActive: boolean
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: componentKey,
    data: { kind: 'toolbox-item', componentKey },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.35 : isActive ? 0.35 : 1 }}
    >
      <ToolboxItem icon={Icon} name={label} />
    </div>
  )
}
