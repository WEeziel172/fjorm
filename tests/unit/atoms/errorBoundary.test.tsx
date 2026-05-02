import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../../../src/components/atoms/errorBoundary'

describe('ErrorBoundary', () => {
  function Bomb() {
    throw new Error('crash')
  }

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Hello world</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders default fallback on error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it('renders custom fallback on error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<div>Custom error boundary</div>}>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Custom error boundary')).toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it('recovers after error when remounted with new key', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(
      <ErrorBoundary key="1">
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Remount with a new key to recover
    rerender(
      <ErrorBoundary key="2">
        <div>Recovered content</div>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Recovered content')).toBeInTheDocument()

    vi.restoreAllMocks()
  })
})
