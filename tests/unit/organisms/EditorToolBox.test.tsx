import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorToolBox } from '../../../src/components/organisms/editorToolBox'
import type { FormItem } from '../../../src/types'

function createMockEditor(): FormItem {
  return {
    id: 'item-1',
    key: 'Header',
    icon: () => null,
    settings: { label: 'My Header', name: 'myHeader' },
    component: () => null,
    editor: () => null,
  }
}

describe('EditorToolBox', () => {
  it('renders the editor panel header', () => {
    render(
      <EditorToolBox
        onChangeFormItemSettings={vi.fn()}
        onChangeFormItemOptions={vi.fn()}
        currentEditor={createMockEditor()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('Editing')).toBeInTheDocument()
    expect(screen.getByText('My Header')).toBeInTheDocument()
  })

  it('renders a back button with aria-label', () => {
    render(
      <EditorToolBox
        onChangeFormItemSettings={vi.fn()}
        onChangeFormItemOptions={vi.fn()}
        currentEditor={createMockEditor()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Back to components')).toBeInTheDocument()
  })

  it('renders "Done" button', () => {
    render(
      <EditorToolBox
        onChangeFormItemSettings={vi.fn()}
        onChangeFormItemOptions={vi.fn()}
        currentEditor={createMockEditor()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('calls onClose when Done is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <EditorToolBox
        onChangeFormItemSettings={vi.fn()}
        onChangeFormItemOptions={vi.fn()}
        currentEditor={createMockEditor()}
        onClose={onClose}
      />,
    )

    await user.click(screen.getByText('Done'))
    expect(onClose).toHaveBeenCalled()
  })
})
