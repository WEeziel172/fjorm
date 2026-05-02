import type { FormComponentSettings } from '../types'

/**
 * Public API convenience for accessing FormComponentSettings fields with type checking.
 * Use this instead of raw bracket access on settings to get a consistent return type
 * and to avoid importing FormComponentSettings directly when only the accessor is needed.
 *
 * @example
 *   const label = getSetting(settings, 'label') // unknown, narrow with your own check
 */
export function getSetting(settings: FormComponentSettings, key: string): unknown {
  return settings[key]
}
