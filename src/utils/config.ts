import type { FormComponentRegistration } from '../types'

export class Config {
  private _components: FormComponentRegistration[] = []
  private _formComponentMappings: Record<string, number> = {}

  get components(): FormComponentRegistration[] {
    return this._components
  }

  getComponent(key: string): FormComponentRegistration | undefined {
    const index = this._formComponentMappings[key]
    return index !== undefined ? this._components[index] : undefined
  }

  addComponents(arr: readonly FormComponentRegistration[]): void {
    let changed = false
    for (const item of arr) {
      const existingIndex = this._formComponentMappings[item.key]
      if (existingIndex !== undefined) {
        console.warn(
          `fjorm: Component key "${item.key}" is already registered. Replacing.`,
        )
        this._components[existingIndex] = item
        changed = true
      } else {
        this._components.push(item)
        changed = true
      }
    }

    if (!changed) return

    const mappings: Record<string, number> = {}
    this._components.forEach((component, index) => {
      mappings[component.key] = index
    })

    this._formComponentMappings = mappings
  }
}
