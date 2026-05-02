import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOptionsManager } from '../../../src/utils/useOptionsManager'

describe('useOptionsManager', () => {
  it('initializes with current options', () => {
    const currOptions = [{ id: 'o1', title: 'A', value: 'a' }]
    const onChange = vi.fn()

    const { result } = renderHook(() => useOptionsManager(currOptions, 'opts', onChange))

    expect(result.current.options).toEqual(currOptions)
  })

  it('initializes empty when undefined', () => {
    const onChange = vi.fn()

    const { result } = renderHook(() => useOptionsManager(undefined, 'opts', onChange))

    expect(result.current.options).toEqual([])
  })

  it('addOption appends a new empty option and notifies', () => {
    const onChange = vi.fn()

    const { result } = renderHook(() => useOptionsManager(undefined, 'opts', onChange))

    act(() => {
      result.current.addOption()
    })

    expect(result.current.options).toHaveLength(1)
    expect(result.current.options[0].title).toBe('')
    expect(result.current.options[0].value).toBe('')
    expect(result.current.options[0].id).toBeTruthy()
    expect(onChange).toHaveBeenCalledWith({
      name: 'opts',
      options: expect.arrayContaining([expect.objectContaining({ title: '', value: '' })]),
    })
  })

  it('editOption updates the correct field and notifies', () => {
    const currOptions = [{ id: 'o1', title: 'Old', value: 'old' }]
    const onChange = vi.fn()

    const { result } = renderHook(() => useOptionsManager(currOptions, 'opts', onChange))

    act(() => {
      result.current.editOption('o1', 'title', 'New Title')
    })

    expect(result.current.options[0].title).toBe('New Title')
    expect(result.current.options[0].value).toBe('old') // unchanged
    expect(onChange).toHaveBeenCalledWith({
      name: 'opts',
      options: [{ id: 'o1', title: 'New Title', value: 'old' }],
    })
  })

  it('deleteOption removes the option and notifies', () => {
    const currOptions = [
      { id: 'o1', title: 'A', value: 'a' },
      { id: 'o2', title: 'B', value: 'b' },
    ]
    const onChange = vi.fn()

    const { result } = renderHook(() => useOptionsManager(currOptions, 'opts', onChange))

    act(() => {
      result.current.deleteOption('o1')
    })

    expect(result.current.options).toHaveLength(1)
    expect(result.current.options[0].id).toBe('o2')
    expect(onChange).toHaveBeenCalledWith({
      name: 'opts',
      options: [{ id: 'o2', title: 'B', value: 'b' }],
    })
  })

  it('initializes with latest options on first render', () => {
    const onChange = vi.fn()

    const { result, rerender } = renderHook(
      ({ opts }) => useOptionsManager(opts, 'opts', onChange),
      { initialProps: { opts: [{ id: 'o1', title: 'A', value: 'a' }] as const } },
    )

    expect(result.current.options).toHaveLength(1)

    rerender({ opts: [{ id: 'o2', title: 'B', value: 'b' }] })

    // Hook re-syncs when props change
    expect(result.current.options).toHaveLength(1)
    expect(result.current.options[0].title).toBe('B')
  })

  it('works without onChange callback', () => {
    const { result } = renderHook(() => useOptionsManager(undefined, 'opts', undefined))

    act(() => {
      result.current.addOption()
    })
    act(() => {
      result.current.editOption(result.current.options[0].id, 'title', 'X')
    })
    act(() => {
      result.current.deleteOption(result.current.options[0].id)
    })

    expect(result.current.options).toHaveLength(0)
  })
})
