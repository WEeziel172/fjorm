import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tag } from '../../../src/components/atoms/tag'
import { FormItemLabel } from '../../../src/components/atoms/formItemLabel'
import { FormItemDisplay } from '../../../src/components/atoms/formItemDisplay'
import { FormComponentHeader } from '../../../src/components/atoms/formComponentHeader'
import { FormComponentEditorContainer } from '../../../src/components/atoms/formComponentEditorContainer'
import { ToolboxItem } from '../../../src/components/atoms/toolboxItem'
import { ErrorBoundary } from '../../../src/components/atoms/errorBoundary'

describe('Atom components', () => {
  it('Tag renders children', () => {
    render(<Tag>Required</Tag>)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('FormItemLabel renders label text', () => {
    render(<FormItemLabel label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('FormItemLabel shows Required tag when required=true', () => {
    render(<FormItemLabel label="Email" required />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('FormItemLabel does not show Required tag when required=false', () => {
    render(<FormItemLabel label="Email" required={false} />)
    expect(screen.queryByText('Required')).not.toBeInTheDocument()
  })

  it('FormItemDisplay renders children', () => {
    render(<FormItemDisplay><span>hello</span></FormItemDisplay>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('FormComponentHeader renders label from settings', () => {
    render(<FormComponentHeader settings={{ label: 'My Header', name: 'header' }} />)
    expect(screen.getByText('My Header')).toBeInTheDocument()
  })

  it('FormComponentEditorContainer renders children', () => {
    render(<FormComponentEditorContainer><span>editor</span></FormComponentEditorContainer>)
    expect(screen.getByText('editor')).toBeInTheDocument()
  })

  it('ToolboxItem renders name', () => {
    const MockIcon = () => <span data-testid="icon" />
    render(<ToolboxItem name="Text Input" icon={MockIcon} />)
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('ErrorBoundary catches errors and renders fallback', () => {
    const Bomb = () => {
      throw new Error('crash')
    }
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('ErrorBoundary renders custom fallback', () => {
    const Bomb = () => {
      throw new Error('crash')
    }
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <Bomb />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Custom error UI')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
