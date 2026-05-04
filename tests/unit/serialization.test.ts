import { describe, it, expect } from 'vitest'
import { serializeFormItems, deserializeFormItems } from '../../src/utils/useFormItems'
import { Config } from '../../src/utils/config'
import type { FormComponentRegistration, FormItem } from '../../src/types'

const mockComponent = () => null
const mockIcon = () => null

function makeRegistration(key: string): FormComponentRegistration {
  return {
    key,
    settings: { label: key, name: key },
    icon: mockIcon,
    component: mockComponent,
    editor: mockComponent,
  }
}

describe('serializeFormItems', () => {
  it('serializes form items to JSON-safe format', () => {
    const items: FormItem[] = [
      {
        id: '1',
        key: 'Header',
        settings: { label: 'Title', name: 'Header' },
        icon: mockIcon,
        component: mockComponent,
        editor: mockComponent,
      },
    ]
    const result = serializeFormItems(items)
    expect(result).toEqual([
      { id: '1', key: 'Header', settings: { label: 'Title', name: 'Header' }, options: undefined },
    ])
  })

  it('includes value in serialized output', () => {
    const items: FormItem[] = [
      {
        id: '1',
        key: 'TextInput',
        settings: { label: 'Email', name: 'email' },
        icon: mockIcon,
        component: mockComponent,
        editor: mockComponent,
        value: 'user@example.com',
      },
      {
        id: '2',
        key: 'TextInput',
        settings: { label: 'Name', name: 'name' },
        icon: mockIcon,
        component: mockComponent,
        editor: mockComponent,
        value: undefined,
      },
    ]
    const result = serializeFormItems(items)
    expect(result[0].value).toBe('user@example.com')
    expect(result[1].value).toBeUndefined()
  })

  it('handles empty array', () => {
    expect(serializeFormItems([])).toEqual([])
  })
})

describe('deserializeFormItems', () => {
  it('rehydrates serialized data using config', () => {
    const config = new Config()
    config.addComponents([makeRegistration('TextInput')])

    const data = [{ id: 'abc', key: 'TextInput', settings: { label: 'Email', name: 'email' } }]
    const result = deserializeFormItems(data, config)

    expect(result).toHaveLength(1)
    expect(result[0].key).toBe('TextInput')
    expect(result[0].settings.label).toBe('Email')
  })

  it('restores value from serialized data', () => {
    const config = new Config()
    config.addComponents([makeRegistration('TextInput')])

    const data = [{ id: 'abc', key: 'TextInput', settings: { label: 'Email', name: 'email' }, value: 'test@test.com' }]
    const result = deserializeFormItems(data, config)

    expect(result[0].value).toBe('test@test.com')
  })

  it('generates id if missing', () => {
    const config = new Config()
    config.addComponents([makeRegistration('Header')])

    const data = [{ id: '', key: 'Header', settings: { label: 'H1', name: 'Header' } }]
    const result = deserializeFormItems(data, config)

    expect(result[0].id).toBeTruthy()
    expect(result[0].id).not.toBe('')
  })

  it('serializes nested children', () => {
    const items: FormItem[] = [
      {
        id: '1', key: 'Container', settings: { label: 'Grid', name: 'container', columns: 2 },
        icon: mockIcon, component: mockComponent, editor: mockComponent,
        children: [
          { id: '2', key: 'TextInput', settings: { label: 'Name', name: 'name' }, icon: mockIcon, component: mockComponent, editor: mockComponent },
        ],
      },
    ]
    const result = serializeFormItems(items)
    expect(result).toEqual([
      {
        id: '1', key: 'Container', settings: { label: 'Grid', name: 'container', columns: 2 },
        children: [
          { id: '2', key: 'TextInput', settings: { label: 'Name', name: 'name' } },
        ],
      },
    ])
  })

  it('serializes deeply nested children', () => {
    const items: FormItem[] = [
      {
        id: 'outer', key: 'Container', settings: { label: 'Outer', name: 'outer', columns: 2 },
        icon: mockIcon, component: mockComponent, editor: mockComponent,
        children: [
          {
            id: 'inner', key: 'Container', settings: { label: 'Inner', name: 'inner', columns: 1 },
            icon: mockIcon, component: mockComponent, editor: mockComponent,
            children: [
              { id: 'leaf', key: 'TextInput', settings: { label: 'Field', name: 'field' }, icon: mockIcon, component: mockComponent, editor: mockComponent },
            ],
          },
        ],
      },
    ]
    const result = serializeFormItems(items)
    expect(result[0].children).toHaveLength(1)
    expect(result[0].children![0].children).toHaveLength(1)
    expect(result[0].children![0].children![0].key).toBe('TextInput')
  })

  it('deserializes nested children from serialized data', () => {
    const config = new Config()
    config.addComponents([makeRegistration('Container'), makeRegistration('TextInput')])

    const data = [
      { id: '1', key: 'Container', settings: { label: 'Grid', name: 'container' },
        children: [
          { id: '2', key: 'TextInput', settings: { label: 'Name', name: 'name' } },
        ],
      },
    ]
    const result = deserializeFormItems(data, config)

    expect(result).toHaveLength(1)
    expect(result[0].key).toBe('Container')
    expect(result[0].children).toHaveLength(1)
    expect(result[0].children![0].key).toBe('TextInput')
    expect(result[0].children![0].id).toBe('2')
  })

  it('round-trips nested structure through serialize/deserialize', () => {
    const config = new Config()
    config.addComponents([makeRegistration('Container'), makeRegistration('TextInput'), makeRegistration('Header')])

    const items: FormItem[] = [
      {
        id: 'c1', key: 'Container', settings: { label: 'Section', name: 'section', columns: 2 },
        icon: mockIcon, component: mockComponent, editor: mockComponent,
        children: [
          { id: 'f1', key: 'TextInput', settings: { label: 'Email', name: 'email' }, icon: mockIcon, component: mockComponent, editor: mockComponent },
          { id: 'f2', key: 'Header', settings: { label: 'Title', name: 'title' }, icon: mockIcon, component: mockComponent, editor: mockComponent },
        ],
      },
    ]

    const serialized = serializeFormItems(items)
    const deserialized = deserializeFormItems(serialized, config)

    expect(deserialized).toHaveLength(1)
    expect(deserialized[0].children).toHaveLength(2)
    expect(deserialized[0].children![0].settings.label).toBe('Email')
    expect(deserialized[0].children![1].key).toBe('Header')
  })
})
