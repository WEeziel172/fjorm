import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorInput } from '../../../src/components/molecules/editorInput'
import { EditorCheckbox } from '../../../src/components/molecules/editorCheckbox'
import { EditorTextArea } from '../../../src/components/molecules/editorTextArea'
import { ComponentEditActions } from '../../../src/components/molecules/componentEditActions'
import { FormComponentHeaderEditor } from '../../../src/components/molecules/formComponentHeaderEditor'
import { FormComponentParagraphEditor } from '../../../src/components/molecules/formComponentParagraphEditor'
import { FormComponentSelectEditor } from '../../../src/components/molecules/formComponentSelectEditor'
describe('EditorInput', () => {
  it('renders with label and value from settings', () => {
    const handleOnChange = vi.fn()
    render(
      <EditorInput
        label="Field name"
        name="name"
        settings={{ label: 'Test', name: 'myField' }}
        handleOnChange={handleOnChange}
      />,
    )
    expect(screen.getByText('Field name')).toBeInTheDocument()
    expect(screen.getByDisplayValue('myField')).toBeInTheDocument()
  })

  it('calls handleOnChange with correct name on input change', async () => {
    const handleOnChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EditorInput
        label="Label"
        name="label"
        settings={{ label: 'Initial', name: 'f' }}
        handleOnChange={handleOnChange}
      />,
    )

    const input = screen.getByDisplayValue('Initial')
    await user.type(input, 'x')

    expect(handleOnChange).toHaveBeenCalled()
    const calls = handleOnChange.mock.calls
    // Verify every call has the correct name
    calls.forEach((call) => {
      expect(call[0].name).toBe('label')
    })
    // At least one call fired with a non-empty event
    const hasChange = calls.some((call) => call[0].event.target.value.length > 0)
    expect(hasChange).toBe(true)
  })
})

describe('EditorCheckbox', () => {
  it('renders checked when setting is truthy', () => {
    render(
      <EditorCheckbox
        label="Required"
        name="required"
        settings={{ label: 'Test', name: 'f', required: true }}
        handleOnChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders unchecked when setting is falsy', () => {
    render(
      <EditorCheckbox
        label="Required"
        name="required"
        settings={{ label: 'Test', name: 'f' }}
        handleOnChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('calls handleOnChange on toggle', async () => {
    const handleOnChange = vi.fn()
    const user = userEvent.setup()
    render(
      <EditorCheckbox
        label="Required"
        name="required"
        settings={{ label: 'Test', name: 'f' }}
        handleOnChange={handleOnChange}
      />,
    )

    await user.click(screen.getByRole('checkbox'))
    expect(handleOnChange).toHaveBeenCalled()
  })
})

describe('EditorTextArea', () => {
  it('renders with content from settings', () => {
    render(
      <EditorTextArea
        label="Content"
        name="content"
        settings={{ label: 'Test', name: 'f', content: 'Hello world' }}
        handleOnChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Hello world')).toBeInTheDocument()
  })
})

describe('ComponentEditActions', () => {
  it('calls onEdit when edit icon clicked', async () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const user = userEvent.setup()

    render(<ComponentEditActions onEdit={onEdit} onDelete={onDelete} id="item-1" />)

    const icons = document.querySelectorAll('.form-component-actions svg')
    await user.click(icons[0])
    expect(onEdit).toHaveBeenCalledWith({ id: 'item-1' })
  })

  it('calls onDelete when delete icon clicked', async () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const user = userEvent.setup()

    render(<ComponentEditActions onEdit={onEdit} onDelete={onDelete} id="item-1" />)

    const icons = document.querySelectorAll('.form-component-actions svg')
    await user.click(icons[1])
    expect(onDelete).toHaveBeenCalledWith({ id: 'item-1' })
  })
})

describe('FormComponentHeaderEditor', () => {
  it('renders with Header label and input', () => {
    render(
      <FormComponentHeaderEditor
        settings={{ label: 'Welcome', name: 'header' }}
        formItemId="test-1"
        onValueChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Welcome')).toBeInTheDocument()
  })
})

describe('FormComponentParagraphEditor', () => {
  it('renders with Content label and textarea', () => {
    render(
      <FormComponentParagraphEditor
        settings={{ label: 'Paragraph', name: 'p', content: 'Hello world' }}
        formItemId="test-2"
        onValueChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Hello world')).toBeInTheDocument()
  })
})

describe('FormComponentSelectEditor', () => {
  it('renders with Label, Field name, Required and Options sections', () => {
    render(
      <FormComponentSelectEditor
        settings={{ label: 'Choose', name: 'choice', required: false }}
        formItemId="test-3"
        onValueChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Field name')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByText('Options')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Choose')).toBeInTheDocument()
    expect(screen.getByDisplayValue('choice')).toBeInTheDocument()
  })
})
