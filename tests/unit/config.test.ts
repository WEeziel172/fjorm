import { describe, it, expect } from 'vitest'
import { Config } from '../../src/utils/config'
import type { FormComponentRegistration } from '../../src/types'

const mockComponent = () => null
const mockIcon = () => null

function makeComponent(key: string): FormComponentRegistration {
  return {
    key,
    settings: { label: key, name: key },
    icon: mockIcon,
    component: mockComponent,
    editor: mockComponent,
  }
}

describe('Config', () => {
  it('initializes with empty state', () => {
    const config = new Config()
    expect(config.components).toEqual([])
    expect(config.getComponent('nonexistent')).toBeUndefined()
  })

  it('addComponents registers components and builds mappings', () => {
    const config = new Config()
    const comps = [makeComponent('Header'), makeComponent('TextInput')]
    config.addComponents(comps)
    expect(config.components).toHaveLength(2)
    expect(config.getComponent('Header')?.key).toBe('Header')
    expect(config.getComponent('TextInput')?.key).toBe('TextInput')
  })

  it('addComponents handles empty array', () => {
    const config = new Config()
    config.addComponents([])
    expect(config.components).toHaveLength(0)
  })

  it('addComponents merges subsequent calls', () => {
    const config = new Config()
    config.addComponents([makeComponent('A')])
    config.addComponents([makeComponent('B')])
    expect(config.components).toHaveLength(2)
    expect(config.getComponent('A')?.key).toBe('A')
    expect(config.getComponent('B')?.key).toBe('B')
  })
})
