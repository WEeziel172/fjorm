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

  it('changeSettings with nonexistent id leaves items unchanged', () => {
    const { config, onChange } = setup()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => {
      result.current.changeSettings('nonexistent', { label: 'X', name: 'X' })
    })

    expect(result.current.formItems).toHaveLength(0)
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

describe('useFormItems — nested/tree operations', () => {
  function makeContainerReg(key = 'Container'): FormComponentRegistration {
    return { key, settings: { label: 'C', name: 'c', columns: 2 }, icon: mockIcon, component: mockComponent, editor: mockComponent }
  }

  function setupWithContainer() {
    const config = new Config()
    config.addComponents([makeReg('Header'), makeReg('TextInput'), makeContainerReg()])
    const onChange = vi.fn()
    return { config, onChange }
  }

  it('addItem with parentId inserts into container children', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id

    act(() => { result.current.addItem('TextInput', 0, containerId) })

    expect(result.current.formItems[0].children).toHaveLength(1)
    expect(result.current.formItems[0].children![0].key).toBe('TextInput')
  })

  it('reorderItems with parentId reorders within container', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id
    act(() => { result.current.addItem('Header', 0, containerId) })
    act(() => { result.current.addItem('TextInput', 1, containerId) })

    act(() => { result.current.reorderItems(0, 1, containerId) })

    expect(result.current.formItems[0].children![0].key).toBe('TextInput')
    expect(result.current.formItems[0].children![1].key).toBe('Header')
  })

  it('moveItem moves from top-level into container', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id
    act(() => { result.current.addItem('TextInput', 1) })
    const textId = result.current.formItems[1].id

    act(() => { result.current.moveItem(textId, containerId, 0) })

    expect(result.current.formItems).toHaveLength(1)
    expect(result.current.formItems[0].children).toHaveLength(1)
    expect(result.current.formItems[0].children![0].key).toBe('TextInput')
  })

  it('moveItem moves from container to top-level', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id
    act(() => { result.current.addItem('TextInput', 0, containerId) })
    const textId = result.current.formItems[0].children![0].id

    act(() => { result.current.moveItem(textId, undefined, 0) })

    expect(result.current.formItems).toHaveLength(2)
    expect(result.current.formItems[0].key).toBe('TextInput')
    expect(result.current.formItems[1].key).toBe('Container')
  })

  it('moveItem between two containers', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    act(() => { result.current.addItem('Container', 1) })
    const firstContainerId = result.current.formItems[0].id
    const secondContainerId = result.current.formItems[1].id
    act(() => { result.current.addItem('TextInput', 0, firstContainerId) })
    const textId = result.current.formItems[0].children![0].id

    act(() => { result.current.moveItem(textId, secondContainerId, 0) })

    expect(result.current.formItems[0].children).toHaveLength(0)
    expect(result.current.formItems[1].children).toHaveLength(1)
    expect(result.current.formItems[1].children![0].key).toBe('TextInput')
  })

  it('deleteItem removes nested child', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id
    act(() => { result.current.addItem('TextInput', 0, containerId) })
    const textId = result.current.formItems[0].children![0].id

    act(() => { result.current.deleteItem(textId) })

    expect(result.current.formItems[0].children).toHaveLength(0)
  })

  it('deleteItem on container removes it and its children', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id
    act(() => { result.current.addItem('TextInput', 0, containerId) })

    act(() => { result.current.deleteItem(containerId) })

    expect(result.current.formItems).toHaveLength(0)
  })

  it('findItem locates nested item', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id
    act(() => { result.current.addItem('TextInput', 0, containerId) })
    const textId = result.current.formItems[0].children![0].id

    expect(result.current.findItem(textId)).toBeDefined()
    expect(result.current.findItem(textId)!.key).toBe('TextInput')
    expect(result.current.findItem(containerId)).toBeDefined()
  })

  it('changeSettings on nested item modifies it', () => {
    const { config, onChange } = setupWithContainer()

    const { result } = renderHook(() => useFormItems(config, undefined, onChange))

    act(() => { result.current.addItem('Container', 0) })
    const containerId = result.current.formItems[0].id
    act(() => { result.current.addItem('TextInput', 0, containerId) })
    const textId = result.current.formItems[0].children![0].id

    act(() => { result.current.changeSettings(textId, { label: 'Updated', name: 'updated' }) })

    expect(result.current.formItems[0].children![0].settings.label).toBe('Updated')
  })

  it('initializes from nested initialData', () => {
    const { config, onChange } = setupWithContainer()

    const initialData = [
      { id: 'c1', key: 'Container', settings: { label: 'Grid', name: 'grid' },
        children: [
          { id: 'f1', key: 'TextInput', settings: { label: 'Name', name: 'name' } },
        ],
      },
    ]

    const { result } = renderHook(() => useFormItems(config, initialData, onChange))

    expect(result.current.formItems).toHaveLength(1)
    expect(result.current.formItems[0].children).toHaveLength(1)
    expect(result.current.formItems[0].children![0].id).toBe('f1')
  })
})
