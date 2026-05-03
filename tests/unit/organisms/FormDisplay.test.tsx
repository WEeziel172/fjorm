import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { FormDisplay } from '../../../src/components/organisms/FormDisplay'
import { Config } from '../../../src/utils/config'
import { formComponents } from '../../../src/components/builderComponents'
import type { FormComponentRegistration, FormComponentProps } from '../../../src/types'

function setupConfig(extra?: FormComponentRegistration[]) {
  const config = new Config()
  config.addComponents([...formComponents, ...(extra ?? [])])
  return config
}

describe('FormDisplay', () => {
  it('renders form items from serialized data', () => {
    const config = setupConfig()

    const data = [
      { id: '1', key: 'Header', settings: { label: 'My Form', name: 'Header' } },
    ]

    render(<FormDisplay data={data} config={config} />)
    expect(screen.getByText('My Form')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('renders no items for empty data', () => {
    const config = setupConfig()

    render(<FormDisplay data={[]} config={config} />)
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('renders with custom form wrapper', () => {
    const config = setupConfig()

    function Wrapper({ children }: { children: React.ReactNode }) {
      return <div data-testid="custom-form">{children}</div>
    }

    render(
      <FormDisplay
        data={[]}
        config={config}
        form={{ component: Wrapper }}
      />,
    )

    expect(screen.getByTestId('custom-form')).toBeInTheDocument()
  })

  it('passes onChangeValue to components', () => {
    const config = setupConfig()

    const CapturingComponent = ({ onChangeValue: ov, settings }: FormComponentProps) => {
      return (
        <button onClick={() => ov?.('captured-value')} data-testid="capture-btn">
          {settings.label}
        </button>
      )
    }

    config.addComponents([{
      key: 'Capture',
      icon: () => null,
      settings: { label: 'Capture', name: 'capture' },
      component: CapturingComponent,
      editor: () => null,
    }])

    const data = [
      { id: '1', key: 'Capture', settings: { label: 'Capture', name: 'capture' } },
    ]

    render(<FormDisplay data={data} config={config} />)
    fireEvent.click(screen.getByTestId('capture-btn'))
    // onChangeValue is wired — we verify via submit behavior below
  })

  it('submits tracked values from onChangeValue', () => {
    const config = setupConfig()
    let capturedOnChangeValue: ((v: unknown) => void) | undefined

    const CapturingComponent = ({ onChangeValue: ov, settings }: FormComponentProps) => {
      capturedOnChangeValue = ov
      return <input type="text" name={settings.name} data-testid="input" />
    }

    config.addComponents([{
      key: 'Capture',
      icon: () => null,
      settings: { label: 'Cap', name: 'cap' },
      component: CapturingComponent,
      editor: () => null,
    }])

    const data = [
      { id: '1', key: 'Capture', settings: { label: 'Cap', name: 'cap' } },
    ]

    const onSubmit = vi.fn()
    render(<FormDisplay data={data} config={config} onSubmit={onSubmit} />)

    // Simulate complex component reporting its value — wrap in act to flush state
    act(() => {
      capturedOnChangeValue?.('complex-value')
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Save' }).closest('form')!)

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ cap: 'complex-value' }),
    )
  })

  it('onChangeValue takes priority over FormData', () => {
    const config = setupConfig()
    let capturedOnChangeValue: ((v: unknown) => void) | undefined

    const CapturingComponent = ({ onChangeValue: ov, settings }: FormComponentProps) => {
      capturedOnChangeValue = ov
      return <input type="text" name={settings.name} defaultValue="browser-value" data-testid="input" />
    }

    config.addComponents([{
      key: 'Capture',
      icon: () => null,
      settings: { label: 'Cap', name: 'cap' },
      component: CapturingComponent,
      editor: () => null,
    }])

    const data = [
      { id: '1', key: 'Capture', settings: { label: 'Cap', name: 'cap' } },
    ]

    const onSubmit = vi.fn()
    render(<FormDisplay data={data} config={config} onSubmit={onSubmit} />)

    // Complex component reports value, then form submits — wrap in act to flush state
    act(() => {
      capturedOnChangeValue?.('tracked-value')
    })
    fireEvent.submit(screen.getByRole('button', { name: 'Save' }).closest('form')!)

    // Tracked value wins over FormData
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ cap: 'tracked-value' }),
    )
  })

  it('unchecked checkbox defaults to false', () => {
    const config = setupConfig()

    function CheckboxComponent({ settings }: FormComponentProps) {
      return <input type="checkbox" name={settings.name} />
    }

    config.addComponents([{
      key: 'Checkbox',
      icon: () => null,
      settings: { label: 'Check', name: 'check' },
      component: CheckboxComponent,
      editor: () => null,
    }])

    const data = [
      { id: '1', key: 'Checkbox', settings: { label: 'Check', name: 'check' } },
    ]

    const onSubmit = vi.fn()
    render(<FormDisplay data={data} config={config} onSubmit={onSubmit} />)

    fireEvent.submit(screen.getByRole('button', { name: 'Save' }).closest('form')!)

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ check: false }),
    )
  })

  it('excludes providesValue:false components from submitted data', () => {
    const config = setupConfig()

    const NonValueComponent = ({ settings }: FormComponentProps) => {
      return <p>{settings.label}</p>
    }

    config.addComponents([{
      key: 'DisplayOnly',
      icon: () => null,
      settings: { label: 'Display Only', name: 'info' },
      component: NonValueComponent,
      editor: () => null,
      providesValue: false,
    }])

    const data = [
      { id: '1', key: 'DisplayOnly', settings: { label: 'Info Block', name: 'info' } },
      { id: '2', key: 'TextInput', settings: { label: 'Name', name: 'name' } },
    ]

    const onSubmit = vi.fn()
    render(<FormDisplay data={data} config={config} onSubmit={onSubmit} />)

    fireEvent.submit(screen.getByRole('button', { name: 'Save' }).closest('form')!)

    expect(onSubmit).toHaveBeenCalledWith(
      expect.not.objectContaining({ info: expect.anything() }),
    )
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: '' }),
    )
  })

  it('pre-fills input from serialized value', () => {
    const config = setupConfig()

    const data = [
      { id: '1', key: 'TextInput', settings: { label: 'Email', name: 'email' }, value: 'prefilled@test.com' },
    ]

    render(<FormDisplay data={data} config={config} />)
    const input = screen.getByDisplayValue('prefilled@test.com')
    expect(input).toBeInTheDocument()
  })

  it('passes fjormValues to custom form wrapper', () => {
    const config = setupConfig()
    let receivedFjormValues: Record<string, unknown> | undefined

    function Wrapper({ children, fjormValues }: { children: React.ReactNode; fjormValues?: Record<string, unknown> }) {
      receivedFjormValues = fjormValues
      return <div data-testid="wrapper">{children}</div>
    }

    const data = [
      { id: '1', key: 'TextInput', settings: { label: 'Name', name: 'name' } },
    ]

    render(
      <FormDisplay
        data={data}
        config={config}
        form={{ component: Wrapper }}
      />,
    )

    expect(receivedFjormValues).toBeDefined()
  })

  it('warns on duplicate field names', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const config = setupConfig()

    const data = [
      { id: '1', key: 'TextInput', settings: { label: 'Field A', name: 'duplicate' } },
      { id: '2', key: 'TextInput', settings: { label: 'Field B', name: 'duplicate' } },
    ]

    render(<FormDisplay data={data} config={config} />)

    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Duplicate field name detected: "duplicate"'),
    )
    consoleWarn.mockRestore()
  })

  it('calls onSubmit from custom form wrapper', () => {
    const config = setupConfig()
    const onSubmit = vi.fn()

    function CustomForm({ children, fjormValues }: { children: React.ReactNode; fjormValues: Record<string, unknown> }) {
      return (
        <form
          data-testid="custom-form"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(fjormValues)
          }}
        >
          {children}
          <button type="submit">Submit</button>
        </form>
      )
    }

    const data = [
      { id: '1', key: 'TextInput', settings: { label: 'Name', name: 'name' } },
    ]

    render(
      <FormDisplay
        data={data}
        config={config}
        form={{ component: CustomForm }}
      />,
    )

    fireEvent.click(screen.getByText('Submit'))
    expect(onSubmit).toHaveBeenCalled()
  })

  it('clears valuesRef when data prop changes', () => {
    const config = setupConfig()
    let capturedOnChangeValue: ((v: unknown) => void) | undefined

    function CaptureRef({ onChangeValue: ov, settings }: FormComponentProps) {
      capturedOnChangeValue = ov
      return <input type="text" name={settings.name} data-testid="input" />
    }

    config.addComponents([{
      key: 'Capture',
      icon: () => null,
      settings: { label: 'X', name: 'x' },
      component: CaptureRef,
      editor: () => null,
    }])

    const data = [
      { id: '1', key: 'Capture', settings: { label: 'Field', name: 'field' } },
    ]

    const { rerender } = render(
      <FormDisplay data={data} config={config} onSubmit={vi.fn()} />,
    )

    // Simulate the component reporting a tracked value
    capturedOnChangeValue?.('stale-value')
    capturedOnChangeValue = undefined

    // Re-render with new data reference to trigger useEffect
    const newData = [
      { id: '2', key: 'Capture', settings: { label: 'Field', name: 'field' } },
    ]

    const onSubmit = vi.fn()
    rerender(<FormDisplay data={newData} config={config} onSubmit={onSubmit} />)

    // Without fix: valuesRef still has 'stale-value' → submission uses it
    // With fix: valuesRef cleared → FormData (empty input) → ''
    fireEvent.submit(screen.getByRole('button', { name: 'Save' }).closest('form')!)

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ field: '' }),
    )
  })
})
