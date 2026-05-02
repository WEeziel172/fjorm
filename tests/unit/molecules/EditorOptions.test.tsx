import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorOptions } from '../../../src/components/molecules/editorOptions'

describe('EditorOptions', () => {
  function setup(existingOptions = [{ id: '1', title: 'Option A', value: 'a' }]) {
    const handleOnChange = vi.fn()
    const handleOnChangeOptions = vi.fn()

    render(
      <EditorOptions
        label="Options"
        name="options"
        settings={{ label: 'Select', name: 'select' }}
        handleOnChange={handleOnChange}
        handleOnChangeOptions={handleOnChangeOptions}
        options={existingOptions}
      />,
    )

    return { handleOnChange, handleOnChangeOptions }
  }

  it('renders existing options', () => {
    setup()
    expect(screen.getByDisplayValue('Option A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('a')).toBeInTheDocument()
  })

  it('adds a new option', async () => {
    const { handleOnChangeOptions } = setup()
    const user = userEvent.setup()

    await user.click(screen.getByText('Add'))

    expect(handleOnChangeOptions).toHaveBeenCalledTimes(1)
    const call = handleOnChangeOptions.mock.calls[0][0]
    expect(call.name).toBe('options')
    expect(call.options).toHaveLength(2)
    expect(call.options[1]).toMatchObject({ title: '', value: '' })
    expect(call.options[1].id).toBeTruthy()
  })

  it('deletes an option', async () => {
    const { handleOnChangeOptions } = setup([
      { id: '1', title: 'A', value: 'a' },
      { id: '2', title: 'B', value: 'b' },
    ])
    const user = userEvent.setup()

    const deleteButtons = screen.getAllByText('x')
    await user.click(deleteButtons[0])

    expect(handleOnChangeOptions).toHaveBeenCalled()
    const call = handleOnChangeOptions.mock.calls[handleOnChangeOptions.mock.calls.length - 1][0]
    expect(call.options).toHaveLength(1)
    expect(call.options[0].id).toBe('2')
  })

  it('edits an option value', async () => {
    setup()
    const user = userEvent.setup()

    const valueInput = screen.getByDisplayValue('a')
    await user.clear(valueInput)
    await user.type(valueInput, 'new-value')

    expect(screen.getByDisplayValue('new-value')).toBeInTheDocument()
  })

  it('rebuilds idMappings after delete so subsequent edits work', async () => {
    const { handleOnChangeOptions } = setup([
      { id: '1', title: 'A', value: 'a' },
      { id: '2', title: 'B', value: 'b' },
    ])
    const user = userEvent.setup()

    // Delete first option
    await user.click(screen.getAllByText('x')[0])

    // Edit remaining option — should not crash
    const remainingInput = screen.getByDisplayValue('b')
    await user.clear(remainingInput)
    await user.type(remainingInput, 'updated-b')

    expect(screen.getByDisplayValue('updated-b')).toBeInTheDocument()
    // Verify the last call has correct option data
    const lastCall = handleOnChangeOptions.mock.calls[handleOnChangeOptions.mock.calls.length - 1][0]
    expect(lastCall.options[0]).toMatchObject({ id: '2', value: 'updated-b' })
  })

  it('round-trip: add, edit, then delete option', async () => {
    const { handleOnChangeOptions } = setup([
      { id: '1', title: 'A', value: 'a' },
      { id: '2', title: 'B', value: 'b' },
    ])
    const user = userEvent.setup()

    // Add a third option
    await user.click(screen.getByText('Add'))
    expect(handleOnChangeOptions).toHaveBeenCalledTimes(1)

    const addCall = handleOnChangeOptions.mock.calls[0][0]
    expect(addCall.options).toHaveLength(3)
    const newOption = addCall.options[2]
    expect(newOption).toMatchObject({ title: '', value: '' })

    // Edit the new option's value (local state updated by useOptionsManager)
    const valueInputs = screen.getAllByPlaceholderText('Value')
    await user.clear(valueInputs[2])
    await user.type(valueInputs[2], 'new-value')

    expect(screen.getByDisplayValue('new-value')).toBeInTheDocument()

    // Delete the first option
    const deleteButtons = screen.getAllByText('x')
    await user.click(deleteButtons[0])

    // Should have 2 remaining options
    const lastCall = handleOnChangeOptions.mock.calls[handleOnChangeOptions.mock.calls.length - 1][0]
    expect(lastCall.options).toHaveLength(2)
    expect(lastCall.options[0].id).toBe('2')
    expect(lastCall.options[1].id).toBe(newOption.id)
  })
})
