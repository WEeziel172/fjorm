import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { FormComponentOption } from '../types'

export function useOptionsManager(
  currOptions: FormComponentOption[] | undefined,
  name: string,
  onChange?: (payload: { name: string; options: FormComponentOption[] }) => void,
) {
  const [options, setOptions] = useState<FormComponentOption[]>(currOptions ?? [])

  // Sync local state when props change externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional prop-to-state sync
    setOptions(currOptions ?? [])
  }, [currOptions])

  const notify = useCallback(
    (next: FormComponentOption[]) => {
      onChange?.({ name, options: next })
    },
    [name, onChange],
  )

  const addOption = useCallback(() => {
    const next = [...options, { id: uuidv4(), title: '', value: '' }]
    setOptions(next)
    notify(next)
  }, [options, notify])

  const editOption = useCallback(
    (id: string, field: string, value: string) => {
      setOptions((prev) => {
        const next = prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
        notify(next)
        return next
      })
    },
    [notify],
  )

  const deleteOption = useCallback(
    (id: string) => {
      setOptions((prev) => {
        const next = prev.filter((o) => o.id !== id)
        notify(next)
        return next
      })
    },
    [notify],
  )

  return { options, addOption, editOption, deleteOption }
}
