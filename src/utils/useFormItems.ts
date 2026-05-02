import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Config } from './config'
import type { FormItem, SerializedFormItem, FormComponentSettings, FormComponentOption } from '../types'

function mapIds(records: FormItem[]): Record<string, number> {
  const idsObj: Record<string, number> = {}
  records.forEach((record, index) => {
    idsObj[record.id] = index
  })
  return idsObj
}

export function deserializeFormItems(data: SerializedFormItem[], config: Config): FormItem[] {
  return data.reduce<FormItem[]>((acc, formItem) => {
    const component = config.getComponent(formItem.key)
    if (!component) {
      console.warn(`fjorm: Unknown component key "${formItem.key}". Skipping.`)
      return acc
    }
    const id = formItem.id || uuidv4()
    acc.push({
      ...component,
      id,
      settings: formItem.settings,
      options: formItem.options,
      value: formItem.value,
    } as FormItem)
    return acc
  }, [])
}

export function serializeFormItems(items: FormItem[]): SerializedFormItem[] {
  return items.map(({ id, key, settings, options, value }) => ({ id, key, settings, options, value }))
}

export function useFormItems(
  config: Config,
  initialData: SerializedFormItem[] | undefined,
  onChange?: (data: SerializedFormItem[]) => void,
) {
  const [formItems, setFormItems] = useState<FormItem[]>(() =>
    initialData ? deserializeFormItems(initialData, config) : [],
  )

  const formItemIdMappings = useMemo(() => mapIds(formItems), [formItems])

  const formItemsRef = useRef(formItems)
  const mappingsRef = useRef(formItemIdMappings)
  useEffect(() => {
    formItemsRef.current = formItems
    mappingsRef.current = formItemIdMappings
  })

  const prevInitialDataRef = useRef(initialData)
  useEffect(() => {
    if (initialData && initialData !== prevInitialDataRef.current) {
      prevInitialDataRef.current = initialData
      setFormItems(deserializeFormItems(initialData, config))
    }
  }, [initialData, config])

  const deleteItem = useCallback((id: string) => {
    setFormItems((prev) => prev.filter((item) => item.id !== id))
    return id
  }, [])

  const findItem = useCallback((id: string): FormItem | undefined => {
    const index = mappingsRef.current[id]
    if (index === undefined) return undefined
    return formItemsRef.current[index]
  }, [])

  const changeSettings = useCallback(
    (id: string, settings: FormComponentSettings) => {
      const index = mappingsRef.current[id]
      if (index === undefined) return
      const next = [...formItemsRef.current]
      next[index] = { ...next[index], settings }
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [onChange],
  )

  const changeOptions = useCallback(
    (id: string, options: FormComponentOption[]) => {
      const index = mappingsRef.current[id]
      if (index === undefined) return
      const next = [...formItemsRef.current]
      next[index] = { ...next[index], options }
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [onChange],
  )

  const addItem = useCallback(
    (key: string, destinationIndex: number) => {
      const component = config.getComponent(key)
      if (!component) {
        console.warn(`fjorm: Cannot add item with unknown key "${key}".`)
        return
      }
      const id = uuidv4()
      const newItem = { ...component, id } as FormItem
      const next = [...formItemsRef.current]
      next.splice(destinationIndex, 0, newItem)
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [config, onChange],
  )

  const reorderItems = useCallback(
    (startIndex: number, endIndex: number) => {
      const next = [...formItemsRef.current]
      const [removed] = next.splice(startIndex, 1)
      next.splice(endIndex, 0, removed)
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [onChange],
  )

  return {
    formItems,
    setFormItems,
    deleteItem,
    findItem,
    changeSettings,
    changeOptions,
    addItem,
    reorderItems,
  }
}
