import { describe, it, expect, vi } from 'vitest'
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

function makeItem(id: string, key: string, overrides: Partial<FormItem> = {}): FormItem {
  return {
    id,
    key,
    settings: { label: key, name: key },
    icon: mockIcon,
    component: mockComponent,
    editor: mockComponent,
    ...overrides,
  } as FormItem
}

describe('serializeFormItems — edge cases', () => {
  it('includes options in serialized output', () => {
    const items = [
      makeItem('1', 'SelectInput', {
        options: [{ id: 'o1', title: 'One', value: '1' }],
      }),
    ]
    const result = serializeFormItems(items)
    expect(result[0].options).toEqual([{ id: 'o1', title: 'One', value: '1' }])
  })

  it('handles items with extra settings keys', () => {
    const items = [
      makeItem('1', 'TextInput', {
        settings: { label: 'Email', name: 'email', placeholder: 'Enter', required: true },
      }),
    ]
    const result = serializeFormItems(items)
    expect(result[0].settings.placeholder).toBe('Enter')
    expect(result[0].settings.required).toBe(true)
  })
})

describe('deserializeFormItems — edge cases', () => {
  it('uses existing id from serialized data', () => {
    const config = new Config()
    config.addComponents([makeRegistration('Header')])

    const data = [{ id: 'pre-existing', key: 'Header', settings: { label: 'H', name: 'Header' } }]
    const result = deserializeFormItems(data, config)

    expect(result[0].id).toBe('pre-existing')
  })

  it('generates new uuid for empty id', () => {
    const config = new Config()
    config.addComponents([makeRegistration('Header')])

    const data = [{ id: '', key: 'Header', settings: { label: 'H', name: 'Header' } }]
    const result = deserializeFormItems(data, config)

    expect(result[0].id).toBeTruthy()
    expect(result[0].id).not.toBe('')
  })

  it('preserves options from serialized data', () => {
    const config = new Config()
    config.addComponents([makeRegistration('SelectInput')])

    const data = [
      {
        id: '1',
        key: 'SelectInput',
        settings: { label: 'S', name: 'Select' },
        options: [{ id: 'o1', title: 'A', value: 'a' }],
      },
    ]
    const result = deserializeFormItems(data, config)

    expect(result[0].options).toEqual([{ id: 'o1', title: 'A', value: 'a' }])
  })

  it('handles multiple items', () => {
    const config = new Config()
    config.addComponents([makeRegistration('Header'), makeRegistration('TextInput')])

    const data = [
      { id: '1', key: 'Header', settings: { label: 'H', name: 'Header' } },
      { id: '2', key: 'TextInput', settings: { label: 'T', name: 'TextInput' } },
    ]
    const result = deserializeFormItems(data, config)

    expect(result).toHaveLength(2)
  })

  it('skips unknown component key and warns', () => {
    const config = new Config()
    config.addComponents([makeRegistration('Known')])

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const data = [
      { id: '1', key: 'UnknownKey', settings: { label: 'X', name: 'x' } },
      { id: '2', key: 'Known', settings: { label: 'Y', name: 'y' } },
    ]
    const result = deserializeFormItems(data, config)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
    expect(warnSpy).toHaveBeenCalledWith(
      'fjorm: Unknown component key "UnknownKey". Skipping.',
    )

    warnSpy.mockRestore()
  })
})

describe('Config — edge cases', () => {
  it('addComponents with duplicate keys replaces in-place', () => {
    const config = new Config()
    config.addComponents([makeRegistration('A')])
    config.addComponents([makeRegistration('A')])
    // second call replaces the existing entry at index 0, no duplicate appended
    expect(config.components).toHaveLength(1)
    expect(config.getComponent('A')?.key).toBe('A')
  })

  it('getComponent returns registration by key', () => {
    const config = new Config()
    config.addComponents([makeRegistration('A')])
    expect(config.components).toHaveLength(1)
    expect(config.getComponent('A')?.key).toBe('A')
  })
})
