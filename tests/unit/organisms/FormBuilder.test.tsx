import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import FormBuilder from '../../../src/components/organisms/FormBuilder'
import type { FormBuilderHandle } from '../../../src/types'
import { serializeFormItems } from '../../../src/utils/useFormItems'
import { Config } from '../../../src/utils/config'
import { formComponents } from '../../../src/components/builderComponents'

describe('FormBuilder', () => {
  function setup() {
    const config = new Config()
    config.addComponents(formComponents)
    return { config }
  }

  it('renders toolbox with components', () => {
    const { config } = setup()
    render(<FormBuilder config={config} />)
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Preview form')).toBeInTheDocument()
  })

  it('renders form container', () => {
    const { config } = setup()
    render(<FormBuilder config={config} />)
    expect(screen.getByRole('region', { name: 'Form builder canvas' })).toBeInTheDocument()
    expect(screen.getByText('Drag components here to build your form')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Components' })).toBeInTheDocument()
  })

  it('toggles preview mode', async () => {
    const { config } = setup()
    const user = userEvent.setup()
    render(<FormBuilder config={config} />)

    const previewBtn = screen.getByText('Preview form')
    await user.click(previewBtn)

    expect(screen.getByText('End preview')).toBeInTheDocument()
  })

  it('calls onChange when an item setting is edited', async () => {
    const { config } = setup()
    const onChange = vi.fn()
    const user = userEvent.setup()
    const initialData = [
      { id: 'header-1', key: 'Header', settings: { label: 'My Header', name: 'header' } },
    ]

    render(<FormBuilder config={config} initialData={initialData} onChange={onChange} />)

    expect(screen.getByText('My Header')).toBeInTheDocument()

    const editBtn = screen.getByRole('button', { name: 'Edit' })
    await user.click(editBtn)

    const headerInput = screen.getByDisplayValue('My Header')
    await user.clear(headerInput)
    await user.type(headerInput, 'Updated')

    expect(onChange).toHaveBeenCalled()
    const serialized = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(serialized[0].settings.label).toBe('Updated')
  })

  it('renders with initialData', () => {
    const { config } = setup()
    const initialData = [
      { id: 'pre-1', key: 'Header', settings: { label: 'Preloaded', name: 'Header' } },
    ]

    render(<FormBuilder config={config} initialData={initialData} />)
    expect(screen.getByText('Preloaded')).toBeInTheDocument()
  })

  it('renders FormContainer items inside DndContext', () => {
    const { config } = setup()
    const initialData = [
      { id: 'item-1', key: 'Header', settings: { label: 'Draggable Header', name: 'h' } },
      { id: 'item-2', key: 'Paragraph', settings: { label: 'Draggable Paragraph', name: 'p', content: 'text' } },
    ]

    render(<FormBuilder config={config} initialData={initialData} />)

    expect(screen.getByText('Draggable Header')).toBeInTheDocument()
    expect(screen.getByText('text')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Form builder canvas' })).toBeInTheDocument()
  })

  it('supports multiple independent FormBuilder instances', () => {
    const { config } = setup()

    render(
      <div>
        <div data-testid="builder-a">
          <FormBuilder config={config} />
        </div>
        <div data-testid="builder-b">
          <FormBuilder config={config} />
        </div>
      </div>,
    )

    const regions = screen.getAllByRole('region', { name: 'Form builder canvas' })
    expect(regions).toHaveLength(2)

    const headings = screen.getAllByRole('heading', { name: 'Components' })
    expect(headings).toHaveLength(2)
  })

  it('serializeFormItems produces correct output', () => {
    const { config } = setup()
    const items = config.components.map((c, i) => ({
      ...c,
      id: String(i),
    }))
    const serialized = serializeFormItems(items)
    expect(serialized).toHaveLength(config.components.length)
    serialized.forEach((item) => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('key')
      expect(item).toHaveProperty('settings')
    })
  })

  it('imperative handle getFormItems returns current items', () => {
    const { config } = setup()
    const ref = createRef<FormBuilderHandle>()
    const initialData = [
      { id: 'h-1', key: 'Header', settings: { label: 'Header', name: 'header' } },
      { id: 'p-1', key: 'Paragraph', settings: { label: 'P', name: 'p', content: 'text' } },
    ]

    render(<FormBuilder config={config} initialData={initialData} ref={ref} />)

    const items = ref.current?.getFormItems()
    expect(items).toHaveLength(2)
    expect(items?.[0]).toMatchObject({ id: 'h-1', key: 'Header' })
    expect(items?.[1]).toMatchObject({ id: 'p-1', key: 'Paragraph' })
  })

  it('imperative handle reset clears editor', async () => {
    const { config } = setup()
    const ref = createRef<FormBuilderHandle>()
    const user = userEvent.setup()
    const initialData = [
      { id: 'h-1', key: 'Header', settings: { label: 'My Header', name: 'header' } },
    ]

    render(<FormBuilder config={config} initialData={initialData} ref={ref} />)

    // Click edit to open editor panel
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByText('Editing')).toBeInTheDocument()

    // Call reset via imperative handle
    ref.current?.reset()

    // Wait for React state to flush and editor to close
    await waitFor(() => {
      expect(screen.queryByText('Editing')).not.toBeInTheDocument()
    })
    // Toolbox should be back
    expect(screen.getByText('Components')).toBeInTheDocument()
  })

  it('delete removes item from canvas and closes editor if editing deleted item', async () => {
    const { config } = setup()
    const user = userEvent.setup()
    const initialData = [
      { id: 'h-1', key: 'Header', settings: { label: 'My Header', name: 'header' } },
    ]

    render(<FormBuilder config={config} initialData={initialData} />)

    // Click edit to open editor
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByText('Editing')).toBeInTheDocument()

    // Click delete
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    // Item should be gone from canvas
    expect(screen.queryByText('My Header')).not.toBeInTheDocument()

    // Editor should close since the edited item was deleted
    await waitFor(() => {
      expect(screen.queryByText('Editing')).not.toBeInTheDocument()
    })
  })

  it('calls onChange with correct serialized data after settings edit', async () => {
    const { config } = setup()
    const onChange = vi.fn()
    const user = userEvent.setup()
    const initialData = [
      { id: 'h-1', key: 'Header', settings: { label: 'My Header', name: 'header' } },
    ]

    render(<FormBuilder config={config} initialData={initialData} onChange={onChange} />)

    const editBtn = screen.getByRole('button', { name: 'Edit' })
    await user.click(editBtn)

    // Type new label
    const labelInput = screen.getByDisplayValue('My Header')
    await user.clear(labelInput)
    await user.type(labelInput, 'New Label')

    // onChange should have been called with serialized data
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0].settings.label).toBe('New Label')
    expect(lastCall[0].key).toBe('Header')
    expect(lastCall[0].id).toBe('h-1')
  })

  it('handles empty initialData gracefully', () => {
    const { config } = setup()
    render(<FormBuilder config={config} initialData={[]} />)
    expect(screen.getByText('Drag components here to build your form')).toBeInTheDocument()
  })
})
