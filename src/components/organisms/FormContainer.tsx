import { memo } from 'react'
import type { ComponentType } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { FormComponentWrapper } from './formComponentWrapper'
import { ErrorBoundary } from '../atoms/errorBoundary'
import type { FormItem, FormComponentProps, FormComponentOption } from '../../types'

interface PlaceholderProps {
  clientHeight: number
  clientWidth: number
  clientY: number
  clientX: number
}

interface DraggableItemProps {
  component: ComponentType<FormComponentProps>
  id: string
  label: string
  options?: FormComponentOption[]
  settings: FormComponentProps['settings']
  index: number
  onEditFormItem: (payload: { id: string }) => void
  onDeleteFormItem: (payload: { id: string }) => void
}

const DraggableItem = memo(function DraggableItem({
  component: Component,
  id,
  label,
  options,
  settings,
  index,
  onEditFormItem,
  onDeleteFormItem,
}: DraggableItemProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ErrorBoundary>
            <FormComponentWrapper
              onEdit={onEditFormItem}
              onDelete={onDeleteFormItem}
              id={id}
            >
              <Component
                options={options}
                settings={settings}
                label={label}
                id={id}
              />
            </FormComponentWrapper>
          </ErrorBoundary>
        </div>
      )}
    </Draggable>
  )
})

export function FormContainer({
  placeholderProps,
  formItems,
  onDeleteFormItem,
  onEditFormItem,
  onContainerMount,
  droppableId,
}: {
  placeholderProps: PlaceholderProps | null
  formItems: FormItem[]
  onDeleteFormItem: (payload: { id: string }) => void
  onEditFormItem: (payload: { id: string }) => void
  onContainerMount?: (element: HTMLDivElement | null) => void
  droppableId: string
}) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => {
        const setMergedRef = (element: HTMLDivElement | null) => {
          provided.innerRef(element)
          onContainerMount?.(element)
        }

        return (
        <>
          <div ref={setMergedRef} className="form-container" role="region" aria-label="Form builder canvas">
            {formItems.length === 0 && (
              <div className="form-container-empty" aria-live="polite">
                Drag components here to build your form
              </div>
            )}
            {formItems.length > 0 &&
              formItems.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  component={item.component}
                  id={item.id}
                  label={item.settings.label}
                  options={item.options}
                  settings={item.settings}
                  index={index}
                  onEditFormItem={onEditFormItem}
                  onDeleteFormItem={onDeleteFormItem}
                />
              ))}
            {provided.placeholder}
            {placeholderProps && snapshot.isDraggingOver && (
              <div
                style={{
                  position: 'absolute',
                  top: placeholderProps.clientY,
                  left: placeholderProps.clientX,
                  height: placeholderProps.clientHeight,
                  marginTop: '0.5rem',
                  border: '1px dashed blue',
                  width: placeholderProps.clientWidth,
                }}
              />
            )}
          </div>
        </>
      )}}
    </Droppable>
  )
}
