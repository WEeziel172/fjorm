import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditorCompiler } from '../../src/components/componentUtils/editorCompiler'

describe('EditorCompiler', () => {
  const baseProps = {
    settings: { label: 'Test', name: 'test' },
    formItemId: 'abc',
    onValueChange: () => {},
  }

  it('renders EditorInput for "EditorInput" field type', () => {
    render(
      <EditorCompiler
        {...baseProps}
        editor={{ label: 'EditorInput' }}
      />,
    )
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('renders EditorCheckbox for "EditorCheckbox" field type', () => {
    render(
      <EditorCompiler
        {...baseProps}
        editor={{ required: 'EditorCheckbox' }}
      />,
    )
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('renders EditorTextArea for "EditorTextArea" field type', () => {
    render(
      <EditorCompiler
        {...baseProps}
        editor={{ content: 'EditorTextArea' }}
      />,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders multiple fields from editor object', () => {
    render(
      <EditorCompiler
        {...baseProps}
        editor={{
          label: 'EditorInput',
          name: 'EditorInput',
          required: 'EditorCheckbox',
        }}
      />,
    )
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('falls back to EditorInput for unknown field types', () => {
    render(
      <EditorCompiler
        {...baseProps}
        editor={{ custom: 'UnknownType' }}
      />,
    )
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })
})
