import { useState, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Config } from './config'
import type { FormItem, SerializedFormItem, FormComponentSettings, FormComponentOption } from '../types'

function findInTree(items: FormItem[], id: string): FormItem | undefined {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findInTree(item.children, id)
      if (found) return found
    }
  }
  return undefined
}

function updateInTree(
  items: FormItem[],
  id: string,
  updater: (item: FormItem) => FormItem,
): FormItem[] {
  return items.map((item) => {
    if (item.id === id) return updater(item)
    if (item.children) {
      return { ...item, children: updateInTree(item.children, id, updater) }
    }
    return item
  })
}

function removeFromTree(items: FormItem[], id: string): [FormItem[], FormItem | undefined] {
  const index = items.findIndex((item) => item.id === id)
  if (index !== -1) {
    const next = [...items]
    const [removed] = next.splice(index, 1)
    return [next, removed]
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].children) {
      const [newChildren, removed] = removeFromTree(items[i].children!, id)
      if (removed) {
        const next = [...items]
        next[i] = { ...next[i], children: newChildren }
        return [next, removed]
      }
    }
  }
  return [items, undefined]
}

function addToTree(
  items: FormItem[],
  parentId: string | undefined,
  newItem: FormItem,
  index: number,
): FormItem[] {
  if (!parentId) {
    const next = [...items]
    next.splice(index, 0, newItem)
    return next
  }
  return items.map((item) => {
    if (item.id === parentId) {
      const children = [...(item.children || [])]
      children.splice(index, 0, newItem)
      return { ...item, children }
    }
    if (item.children) {
      return { ...item, children: addToTree(item.children, parentId, newItem, index) }
    }
    return item
  })
}

function reorderInTree(
  items: FormItem[],
  parentId: string | undefined,
  from: number,
  to: number,
): FormItem[] {
  if (!parentId) {
    const next = [...items]
    const [removed] = next.splice(from, 1)
    next.splice(to, 0, removed)
    return next
  }
  return items.map((item) => {
    if (item.id === parentId) {
      const children = [...(item.children || [])]
      const [removed] = children.splice(from, 1)
      children.splice(to, 0, removed)
      return { ...item, children }
    }
    if (item.children) {
      return { ...item, children: reorderInTree(item.children, parentId, from, to) }
    }
    return item
  })
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
      ...(formItem.children
        ? { children: deserializeFormItems(formItem.children, config) }
        : {}),
    } as FormItem)
    return acc
  }, [])
}

export function serializeFormItems(items: FormItem[]): SerializedFormItem[] {
  return items.map(({ id, key, settings, options, value, children }) => ({
    id,
    key,
    settings,
    options,
    value,
    ...(children ? { children: serializeFormItems(children) } : {}),
  }))
}

export function useFormItems(
  config: Config,
  initialData: SerializedFormItem[] | undefined,
  onChange?: (data: SerializedFormItem[]) => void,
) {
  const [formItems, setFormItems] = useState<FormItem[]>(() =>
    initialData ? deserializeFormItems(initialData, config) : [],
  )

  const formItemsRef = useRef(formItems)
  useEffect(() => {
    formItemsRef.current = formItems
  })

  const prevInitialDataRef = useRef(initialData)
  useEffect(() => {
    if (initialData && initialData !== prevInitialDataRef.current) {
      prevInitialDataRef.current = initialData
      setFormItems(deserializeFormItems(initialData, config))
    }
  }, [initialData, config])

  const findItem = useCallback((id: string): FormItem | undefined => {
    return findInTree(formItemsRef.current, id)
  }, [])

  const deleteItem = useCallback(
    (id: string) => {
      const [next] = removeFromTree(formItemsRef.current, id)
      setFormItems(next)
      onChange?.(serializeFormItems(next))
      return id
    },
    [onChange],
  )

  const changeSettings = useCallback(
    (id: string, settings: FormComponentSettings) => {
      const next = updateInTree(formItemsRef.current, id, (item) => ({ ...item, settings }))
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [onChange],
  )

  const changeOptions = useCallback(
    (id: string, options: FormComponentOption[]) => {
      const next = updateInTree(formItemsRef.current, id, (item) => ({ ...item, options }))
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [onChange],
  )

  const addItem = useCallback(
    (key: string, destinationIndex: number, parentId?: string) => {
      const component = config.getComponent(key)
      if (!component) {
        console.warn(`fjorm: Cannot add item with unknown key "${key}".`)
        return
      }
      const id = uuidv4()
      const newItem = { ...component, id } as FormItem
      const next = addToTree(formItemsRef.current, parentId, newItem, destinationIndex)
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [config, onChange],
  )

  const reorderItems = useCallback(
    (startIndex: number, endIndex: number, parentId?: string) => {
      const next = reorderInTree(formItemsRef.current, parentId, startIndex, endIndex)
      setFormItems(next)
      onChange?.(serializeFormItems(next))
    },
    [onChange],
  )

  const moveItem = useCallback(
    (id: string, toParentId: string | undefined, toIndex: number) => {
      const [afterRemove, removed] = removeFromTree(formItemsRef.current, id)
      if (!removed) return
      const next = addToTree(afterRemove, toParentId, removed, toIndex)
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
    moveItem,
  }
}
