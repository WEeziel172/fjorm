import { memo, useMemo } from 'react'
import type { ComponentType } from 'react'
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { FormComponentWrapper } from './formComponentWrapper'
import { ErrorBoundary } from '../atoms/errorBoundary'
import type { FormItem, FormComponentProps, FormComponentOption } from '../../types'

// --- Sortable canvas item (non-container) ---

interface SortableItemProps {
  component: ComponentType<FormComponentProps>
  id: string
  label: string
  options?: FormComponentOption[]
  settings: FormComponentProps['settings']
  onEditFormItem: (payload: { id: string }) => void
  onDeleteFormItem: (payload: { id: string }) => void
}

const SortableItem = memo(function SortableItem({
  component: Component,
  id,
  label,
  options,
  settings,
  onEditFormItem,
  onDeleteFormItem,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { kind: 'canvas-item' },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <ErrorBoundary>
        <FormComponentWrapper onEdit={onEditFormItem} onDelete={onDeleteFormItem} id={id}>
          <Component options={options} settings={settings} label={label} id={id} />
        </FormComponentWrapper>
      </ErrorBoundary>
    </div>
  )
})

// --- Sortable container item ---

interface SortableContainerProps {
  item: FormItem
  onEditFormItem: (payload: { id: string }) => void
  onDeleteFormItem: (payload: { id: string }) => void
}

function SortableContainer({ item, onEditFormItem, onDeleteFormItem }: SortableContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { kind: 'canvas-item' },
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `container-${item.id}`,
    data: { kind: 'container-dropzone', containerId: item.id },
  })

  const isEmpty = !item.children || item.children.length === 0
  const childIds = useMemo(
    () => item.children?.map((c) => c.id) ?? [],
    [item.children],
  )

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      }}
      {...attributes}
    >
      <ErrorBoundary>
        <FormComponentWrapper onEdit={onEditFormItem} onDelete={onDeleteFormItem} id={item.id}>
          {/* Drag handle — only this bar initiates container reorder */}
          <div {...listeners} className="form-container-container-handle">
            <span className="form-container-container-label">{item.settings.label}</span>
          </div>

          {/* Droppable zone — layout is handled by the user's component */}
          <div
            ref={setDropRef}
            className="form-container-container-dropzone"
            style={{
              minHeight: isEmpty ? '5rem' : undefined,
              padding: isEmpty ? '0.5rem' : undefined,
              background: isOver ? 'rgba(91, 110, 255, 0.06)' : undefined,
              outline: isOver
                ? '2px dashed var(--fj-color-drop-indicator)'
                : isEmpty
                  ? '1px dashed rgba(0,0,0,0.12)'
                  : undefined,
              borderRadius: 'var(--fj-radius-sm)',
              transition: 'background 180ms ease, outline 180ms ease',
            }}
          >
            <SortableContext items={childIds} strategy={rectSortingStrategy}>
              {isEmpty ? (
                <div
                  style={{
                    minHeight: '5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--fj-color-text-muted)',
                  fontSize: '0.78rem',
                  fontStyle: 'italic',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              >
                Drop components here
              </div>
            ) : (
              <item.component
                settings={item.settings}
                label={item.settings.label}
                id={item.id}
                options={item.options}
              >
                {item.children?.map((child, childIndex) => (
                  <RecursiveItem
                    key={child.id}
                    item={child}
                    index={childIndex}
                    onEditFormItem={onEditFormItem}
                    onDeleteFormItem={onDeleteFormItem}
                  />
                ))}
              </item.component>
            )}
            </SortableContext>
          </div>
        </FormComponentWrapper>
      </ErrorBoundary>
    </div>
  )
}

// --- Recursive renderer ---

interface RecursiveItemProps {
  item: FormItem
  index: number
  onEditFormItem: (payload: { id: string }) => void
  onDeleteFormItem: (payload: { id: string }) => void
}

export function RecursiveItem({
  item,
  index,
  onEditFormItem,
  onDeleteFormItem,
}: RecursiveItemProps) {
  void index
  if (item.isContainer) {
    return (
      <SortableContainer
        item={item}
        onEditFormItem={onEditFormItem}
        onDeleteFormItem={onDeleteFormItem}
      />
    )
  }

  return (
    <SortableItem
      component={item.component}
      id={item.id}
      label={item.settings.label}
      options={item.options}
      settings={item.settings}
      onEditFormItem={onEditFormItem}
      onDeleteFormItem={onDeleteFormItem}
    />
  )
}

// --- Default display component (used in preview mode) ---

export function FormComponentContainer({
  children,
}: FormComponentProps) {
  return <>{children}</>
}
