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
})
