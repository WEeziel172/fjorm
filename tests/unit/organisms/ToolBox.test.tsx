import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DndContext } from '@dnd-kit/core'
import { ToolBox } from '../../../src/components/organisms/ToolBox'

function renderToolBox(previewForm = false, setPreviewForm = vi.fn()) {
  const formComponents = [
    { key: 'Header', icon: () => null, settings: { label: 'Header', name: 'header' } },
    { key: 'Paragraph', icon: () => null, settings: { label: 'Paragraph', name: 'paragraph' } },
  ]

  return render(
    <DndContext onDragEnd={vi.fn()}>
      <ToolBox
        formComponents={formComponents}
        setPreviewForm={setPreviewForm}
        previewForm={previewForm}
        activeDragKey={null}
      />
    </DndContext>,
  )
}

describe('ToolBox', () => {
  it('renders with components', () => {
    renderToolBox()
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
  })

  it('renders "Preview form" button', () => {
    renderToolBox()
    expect(screen.getByText('Preview form')).toBeInTheDocument()
  })

  it('toggles preview mode', async () => {
    const setPreviewForm = vi.fn()
    const user = userEvent.setup()
    renderToolBox(false, setPreviewForm)

    await user.click(screen.getByText('Preview form'))
    expect(setPreviewForm).toHaveBeenCalledWith(true)
  })

  it('shows "End preview" when in preview mode', () => {
    renderToolBox(true)
    expect(screen.getByText('End preview')).toBeInTheDocument()
  })
})
