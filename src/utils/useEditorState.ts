import { useCallback, useEffect, useState } from 'react'
import type { FormComponentSettings, FormComponentOption } from '../types'

export function useEditorState(
  id: string,
  currentSettings: FormComponentSettings,
  currentOptions: FormComponentOption[] | undefined,
  onChange: (payload: { id: string; settings: FormComponentSettings }) => void,
  onChangeOptions: (payload: { id: string; options: FormComponentOption[] }) => void,
) {
  const [settings, setSettings] = useState<FormComponentSettings>(currentSettings)
  const [options, setOptions] = useState<FormComponentOption[]>(currentOptions ?? [])

  // Sync local state when props change externally (e.g., undo/redo, programmatic update)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional prop-to-state sync
    setSettings(currentSettings)
  }, [currentSettings])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional prop-to-state sync
    setOptions(currentOptions ?? [])
  }, [currentOptions])

  const handleOnChangeSettings = useCallback(
    ({ name, value }: { name: string; value: unknown }) => {
      setSettings((prev) => {
        const next = { ...prev, [name]: value }
        onChange({ id, settings: next })
        return next
      })
    },
    [id, onChange],
  )

  const handleOnChangeOptions = useCallback(
    ({ options: newOptions }: { name: string; options: FormComponentOption[] }) => {
      setOptions(newOptions)
      onChangeOptions({ id, options: newOptions })
    },
    [id, onChangeOptions],
  )

  return {
    settings,
    options,
    handleOnChangeSettings,
    handleOnChangeOptions,
  }
}
