import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormItems, serializeFormItems, deserializeFormItems } from '../../../src/utils/useFormItems'
import { Config } from '../../../src/utils/config'
import type { FormComponentRegistration, FormItem, SerializedFormItem } from '../../../src/types'

const mockComponent = () => null
const mockIcon = () => null

function makeReg(key: string): FormComponentRegistration {
  return {
    key,
    settings: { label: key, name: key },
    icon: mockIcon,
    component: mockComponent,
    editor: mockComponent,
  }
}

function setup() {
  const config = new Config()
  config.addComponents([makeReg('Header'), makeReg('TextInput')])
  const onChange = vi.fn()
  return { config, onChange }
}

describe('useFormItems', () => {
  it('initializes with empty items when no initialData', () => {
    const { config, onChange } = setup()
    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    expect(result.current.formItems).toEqual([])
  })

  it('initializes from initialData', () => {
    const { config, onChange } = setup()
    const initialData = [{ id: '1', key: 'Header', settings: { label: 'H', name: 'Header' } }]

    const { result } = renderHook(() => useFormItems(config, initialData, onChange))

    expect(result.current.formItems).toHaveLength(1)
    expect(result.current.formItems[0].id).toBe('1')
    expect(result.current.formItems[0].key).toBe('Header')
  })

  it('deleteItem removes an item and returns its id', () => {
    const { config, onChange } = setup()
    const initialData = [{ id: '1', key: 'Header', settings: { label: 'H', name: 'Header' } }]

    const { result } = renderHook(() => useFormItems(config, initialData, onChange))

    act(() => {
      result.current.deleteItem('1')
    })

    expect(result.current.formItems).toHaveLength(0)
  })

  it('findItem returns the item or undefined', () => {
    const { config, onChange } = setup()
    const initialData = [{ id: '1', key: 'Header', settings: { label: 'H', name: 'Header' } }]

    const { result } = renderHook(() => useFormItems(config, initialData, onChange))

    expect(result.current.findItem('1')).toBeDefined()
    expect(result.current.findItem('nonexistent')).toBeUndefined()
  })

  it('changeSettings modifies item and calls onChange', () => {
    const { config, onChange } = setup()
    const initialData = [{ id: '1', key: 'Header', settings: { label: 'H', name: 'Header' } }]

    const { result } = renderHook(() => useFormItems(config, initialData, onChange))

    act(() => {
      result.current.changeSettings('1', { label: 'New H', name: 'Header' })
    })

    expect(result.current.formItems[0].settings.label).toBe('New H')
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ settings: { label: 'New H', name: 'Header' } }),
    ])
  })

  it('changeOptions modifies item options and calls onChange', () => {
    const { config, onChange } = setup()
    const initialData = [{ id: '1', key: 'Header', settings: { label: 'H', name: 'Header' } }]

    const { result } = renderHook(() => useFormItems(config, initialData, onChange))

    const newOpts = [{ id: 'o1', title: 'A', value: 'a' }]
    act(() => {
      result.current.changeOptions('1', newOpts)
    })

    expect(result.current.formItems[0].options).toEqual(newOpts)
  })

  it('addItem inserts at index and calls onChange', () => {
    const { config, onChange } = setup()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => {
      result.current.addItem('Header', 0)
    })

    expect(result.current.formItems).toHaveLength(1)
    expect(result.current.formItems[0].key).toBe('Header')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('reorderItems swaps items and calls onChange', () => {
    const { config, onChange } = setup()
    const initialData = [
      { id: '1', key: 'Header', settings: { label: 'A', name: 'A' } },
      { id: '2', key: 'TextInput', settings: { label: 'B', name: 'B' } },
    ]

    const { result } = renderHook(() => useFormItems(config, initialData, onChange))

    act(() => {
      result.current.reorderItems(0, 1)
    })

    expect(result.current.formItems[0].key).toBe('TextInput')
    expect(result.current.formItems[1].key).toBe('Header')
  })

  it('changeSettings with nonexistent id is a no-op', () => {
    const { config, onChange } = setup()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => {
      result.current.changeSettings('nonexistent', { label: 'X', name: 'X' })
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('serializeFormItems includes value', () => {
    const items = [
      { id: '1', key: 'A', settings: { label: 'A', name: 'a' }, icon: mockIcon, component: mockComponent, editor: mockComponent, value: 'test' } as FormItem,
    ]
    const result = serializeFormItems(items)
    expect(result[0].value).toBe('test')
  })

  it('deserializeFormItems restores value', () => {
    const { config } = setup()
    const data = [{ id: '1', key: 'Header', settings: { label: 'H', name: 'Header' }, value: 'v' }]
    const result = deserializeFormItems(data, config)
    expect(result[0].value).toBe('v')
  })

  it('re-initializes when initialData prop changes', () => {
    const { config, onChange } = setup()
    const initialData = [{ id: '1', key: 'Header', settings: { label: 'H', name: 'Header' } }]

    const { result, rerender } = renderHook(
      ({ data }) => useFormItems(config, data, onChange),
      { initialProps: { data: initialData as SerializedFormItem[] | undefined } },
    )

    expect(result.current.formItems).toHaveLength(1)

    const newData = [
      { id: '2', key: 'TextInput', settings: { label: 'T', name: 'TextInput' } },
    ]

    rerender({ data: newData })

    expect(result.current.formItems).toHaveLength(1)
    expect(result.current.formItems[0].key).toBe('TextInput')
    expect(result.current.formItems[0].id).toBe('2')
  })
})
