import { useCallback } from 'react'

interface ChangeEvent {
  target: { type: string; checked?: boolean; value: string }
}

export function useEditorChange(
  onValueChange: (payload: { name: string; value: unknown }) => void,
) {
  const handleOnChange = useCallback(
    ({ event, name }: { event: ChangeEvent; name: string }) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
      onValueChange({ name, value })
    },
    [onValueChange],
  )

  return handleOnChange
}
