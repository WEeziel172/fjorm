import { Draggable, Droppable } from '@hello-pangea/dnd'
import { ToolboxItem } from '../atoms/toolboxItem'
import type { FormComponentRegistration } from '../../types'

export function ToolBox({
  formComponents,
  setPreviewForm,
  previewForm,
  droppableId,
}: {
  formComponents: FormComponentRegistration[]
  setPreviewForm: (preview: boolean) => void
  previewForm: boolean
  droppableId: string
}) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div ref={provided.innerRef} className="toolbox-container">
          <h3>Components</h3>
          {formComponents.length > 0 &&
            formComponents.map(({ key, icon, settings: { label } }, index) => {
              return (
                <Draggable key={key} draggableId={key} index={index}>
                  {(draggableProvided) => (
                    <div
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      ref={draggableProvided.innerRef}
                    >
                      <ToolboxItem
                        icon={icon}
                        name={label}
                      />
                    </div>
                  )}
                </Draggable>
              )
            })}
          <div className="toolbox-actions">
            <button
              className="toolbox-item--save-btn"
              onClick={() => setPreviewForm(!previewForm)}
            >
              {previewForm ? 'End preview' : 'Preview form'}
            </button>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
