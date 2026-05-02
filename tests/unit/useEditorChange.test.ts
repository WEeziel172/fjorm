import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEditorChange } from '../../src/utils/useEditorChange'

describe('useEditorChange', () => {
  it('returns a function', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useEditorChange(onChange))
    expect(typeof result.current).toBe('function')
  })

  it('calls onValueChange with text input value', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useEditorChange(onChange))

    act(() => {
      result.current({
        event: { target: { type: 'text', value: 'hello' } },
        name: 'label',
      })
    })

    expect(onChange).toHaveBeenCalledWith({ name: 'label', value: 'hello' })
  })

  it('calls onValueChange with checkbox checked state', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useEditorChange(onChange))

    act(() => {
      result.current({
        event: { target: { type: 'checkbox', checked: true } },
        name: 'required',
      })
    })

    expect(onChange).toHaveBeenCalledWith({ name: 'required', value: true })
  })

  it('calls onValueChange with unchecked checkbox state', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useEditorChange(onChange))

    act(() => {
      result.current({
        event: { target: { type: 'checkbox', checked: false } },
        name: 'required',
      })
    })

    expect(onChange).toHaveBeenCalledWith({ name: 'required', value: false })
  })
})
