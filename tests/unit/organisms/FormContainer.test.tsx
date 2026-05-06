import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
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

  function renderInDndContext(ui: React.ReactElement) {
    return render(
      <DndContext onDragEnd={vi.fn()}>
        {ui}
      </DndContext>,
    )
  }

  it('renders form items', () => {
    renderInDndContext(
      <FormContainer
        formItems={mockFormItems}
        onDeleteFormItem={vi.fn()}
        onEditFormItem={vi.fn()}
      />,
    )

    expect(screen.getByText('Header Content')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Form builder canvas' })).toBeInTheDocument()
  })

  it('renders empty state when no form items', () => {
    renderInDndContext(
      <FormContainer
        formItems={[]}
        onDeleteFormItem={vi.fn()}
        onEditFormItem={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('region', { name: 'Form builder canvas' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Drag components here to build your form')).toBeInTheDocument()
  })
})
