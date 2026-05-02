import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormComponentInput } from '../../../src/components/organisms/formComponentInput'
import { FormComponentSelect } from '../../../src/components/organisms/formComponentSelect'
import { FormComponentParagraph } from '../../../src/components/molecules/formComponentParagraph'
import { FormComponentWrapper } from '../../../src/components/organisms/formComponentWrapper'
import { Option } from '../../../src/components/atoms/option'

describe('FormComponentInput', () => {
  it('renders label and input', () => {
    render(
      <FormComponentInput
        id="1"
        label="Email"
        settings={{ label: 'Email', name: 'email', placeholder: 'Enter email', required: true }}
      />,
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('renders without required tag when not required', () => {
    render(
      <FormComponentInput id="1" label="Name" settings={{ label: 'Name', name: 'name' }} />,
    )
    expect(screen.queryByText('Required')).not.toBeInTheDocument()
  })
})

describe('FormComponentSelect', () => {
  it('renders label and options', () => {
    render(
      <FormComponentSelect
        id="1"
        label="Country"
        settings={{ label: 'Country', name: 'country' }}
        options={[
          { id: '1', title: 'Finland', value: 'fi' },
          { id: '2', title: 'Sweden', value: 'se' },
        ]}
      />,
    )
    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('Finland')).toBeInTheDocument()
    expect(screen.getByText('Sweden')).toBeInTheDocument()
  })

  it('renders without options', () => {
    render(
      <FormComponentSelect id="1" label="Empty" settings={{ label: 'Empty', name: 'empty' }} />,
    )
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })
})

describe('FormComponentParagraph', () => {
  it('renders content from settings', () => {
    render(<FormComponentParagraph settings={{ label: 'P', name: 'p', content: 'Some text here' }} />)
    expect(screen.getByText('Some text here')).toBeInTheDocument()
  })

  it('renders empty when no content', () => {
    render(<FormComponentParagraph settings={{ label: 'P', name: 'p' }} />)
    expect(document.querySelector('.form-component')).toBeInTheDocument()
  })
})

describe('FormComponentWrapper', () => {
  it('renders children', () => {
    render(
      <FormComponentWrapper onEdit={vi.fn()} onDelete={vi.fn()} id="1">
        <span data-testid="child">Hello</span>
      </FormComponentWrapper>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})

describe('Option', () => {
  it('renders value and title inputs', () => {
    render(
      <Option
        id="opt-1"
        value="val"
        title="Title"
        onChange={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByDisplayValue('val')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Title')).toBeInTheDocument()
  })

  it('calls onDelete when x clicked', async () => {
    const onDelete = vi.fn()
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()

    render(
      <Option id="opt-1" value="v" title="t" onChange={vi.fn()} onDelete={onDelete} />,
    )

    await user.click(screen.getByText('x'))
    expect(onDelete).toHaveBeenCalledWith({ id: 'opt-1' })
  })
})
