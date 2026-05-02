import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { FormContainer } from '../../../src/components/organisms/FormContainer'
import type { FormItem } from '../../../src/types'

describe('FormContainer', () => {
  const mockFormItems: FormItem[] = [
    {
      id: '1',
      key: 'Header',
      settings: { label: 'My Header', name: 'header' },
      icon: () => null,
      component: () => <div>Header Content</div>,
      editor: () => null,
    },
  ]

  function renderInDragContext(ui: React.ReactElement) {
    return render(
      <DragDropContext onDragEnd={vi.fn()}>
        {ui}
      </DragDropContext>,
    )
  }

  it('renders form items', () => {
    renderInDragContext(
      <Droppable droppableId="test">
        {() => (
          <FormContainer
            placeholderProps={null}
            formItems={mockFormItems}
            onDeleteFormItem={vi.fn()}
            onEditFormItem={vi.fn()}
            droppableId="canvas"
          />
        )}
      </Droppable>,
    )

    expect(screen.getByText('Header Content')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Form builder canvas' })).toBeInTheDocument()
  })

  it('renders empty state when no form items', () => {
    renderInDragContext(
      <Droppable droppableId="test">
        {() => (
          <FormContainer
            placeholderProps={null}
            formItems={[]}
            onDeleteFormItem={vi.fn()}
            onEditFormItem={vi.fn()}
            droppableId="canvas"
          />
        )}
      </Droppable>,
    )

    expect(
      screen.getByRole('region', { name: 'Form builder canvas' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Drag components here to build your form')).toBeInTheDocument()
  })

  it('does not render drag placeholder when placeholderProps is null', () => {
    const { container } = renderInDragContext(
      <Droppable droppableId="test">
        {() => (
          <FormContainer
            placeholderProps={null}
            formItems={mockFormItems}
            onDeleteFormItem={vi.fn()}
            onEditFormItem={vi.fn()}
            droppableId="canvas"
          />
        )}
      </Droppable>,
    )

    // The dashed border placeholder should not be rendered
    const placeholderDiv = container.querySelector('[style*="dashed"]')
    expect(placeholderDiv).not.toBeInTheDocument()
  })

  it('calls onContainerMount when element mounts', () => {
    const onContainerMount = vi.fn()

    renderInDragContext(
      <Droppable droppableId="test">
        {() => (
          <FormContainer
            placeholderProps={null}
            formItems={[]}
            onDeleteFormItem={vi.fn()}
            onEditFormItem={vi.fn()}
            onContainerMount={onContainerMount}
            droppableId="canvas"
          />
        )}
      </Droppable>,
    )

    expect(onContainerMount).toHaveBeenCalledTimes(1)
    expect(onContainerMount).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  })
})
