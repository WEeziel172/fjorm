import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEditorState } from '../../../src/utils/useEditorState'
import type { FormComponentSettings } from '../../../src/types'

describe('useEditorState', () => {
  const baseSettings: FormComponentSettings = { label: 'Test', name: 'testField' }

  it('initializes with current settings and options', () => {
    const onChange = vi.fn()
    const onChangeOptions = vi.fn()

    const { result } = renderHook(() =>
      useEditorState('item-1', baseSettings, [{ id: 'o1', title: 'A', value: 'a' }], onChange, onChangeOptions),
    )

    expect(result.current.settings).toEqual(baseSettings)
    expect(result.current.options).toEqual([{ id: 'o1', title: 'A', value: 'a' }])
  })

  it('calls onChange when handleOnChangeSettings is invoked', () => {
    const onChange = vi.fn()
    const onChangeOptions = vi.fn()

    const { result } = renderHook(() =>
      useEditorState('item-1', baseSettings, undefined, onChange, onChangeOptions),
    )

    act(() => {
      result.current.handleOnChangeSettings({ name: 'label', value: 'New Label' })
    })

    expect(onChange).toHaveBeenCalledWith({
      id: 'item-1',
      settings: { label: 'New Label', name: 'testField' },
    })
  })

  it('preserves other settings when one field changes', () => {
    const onChange = vi.fn()
    const onChangeOptions = vi.fn()

    const { result } = renderHook(() =>
      useEditorState('item-1', baseSettings, undefined, onChange, onChangeOptions),
    )

    act(() => {
      result.current.handleOnChangeSettings({ name: 'label', value: 'New Label' })
    })

    const payload = onChange.mock.calls[0][0]
    expect(payload.settings.name).toBe('testField')
  })

  it('calls onChangeOptions when handleOnChangeOptions is invoked', () => {
    const onChange = vi.fn()
    const onChangeOptions = vi.fn()

    const { result } = renderHook(() =>
      useEditorState('item-1', baseSettings, undefined, onChange, onChangeOptions),
    )

    act(() => {
      result.current.handleOnChangeOptions({
        name: 'opts',
        options: [{ id: 'o1', title: 'One', value: '1' }],
      })
    })

    expect(onChangeOptions).toHaveBeenCalledWith({
      id: 'item-1',
      options: [{ id: 'o1', title: 'One', value: '1' }],
    })
  })

  it('initializes with latest settings on first render', () => {
    const onChange = vi.fn()
    const onChangeOptions = vi.fn()

    const { result, rerender } = renderHook(
      ({ settings }) => useEditorState('item-1', settings, undefined, onChange, onChangeOptions),
      { initialProps: { settings: baseSettings } },
    )

    expect(result.current.settings.label).toBe('Test')

    rerender({ settings: { label: 'Updated', name: 'testField' } })

    // Hook re-syncs when props change
    expect(result.current.settings.label).toBe('Updated')
  })

  it('defaults options to empty array when undefined', () => {
    const onChange = vi.fn()
    const onChangeOptions = vi.fn()

    const { result } = renderHook(() =>
      useEditorState('item-1', baseSettings, undefined, onChange, onChangeOptions),
    )

    expect(result.current.options).toEqual([])
  })
})
