import { useState, useCallback, useRef } from 'react'
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import type { DndItemData } from '../types'

function computeInsertIndex(
  event: DragOverEvent,
  getItemIndex: (id: string, parentId?: string) => number,
  getRootItemCount: () => number,
  getParentId?: (id: string) => string | undefined,
): { idx: number; parentId: string | undefined } | null {
  const { over } = event
  if (!over) return null

  const to = over.data.current as DndItemData | undefined
  if (!to) return null

  if (to.kind === 'canvas-item') {
    const overParentId = getParentId ? getParentId(String(over.id)) : undefined
    const idx = getItemIndex(String(over.id), overParentId)
    const baseIdx = idx >= 0 ? idx : 0

    const activatorY = (event.activatorEvent as MouseEvent).clientY ?? 0
    const pointerY = activatorY + event.delta.y
    const centerY = over.rect.top + over.rect.height / 2

    return { idx: pointerY > centerY ? baseIdx + 1 : baseIdx, parentId: overParentId }
  }

  if (to.kind === 'container-dropzone') {
    return { idx: 0, parentId: to.containerId }
  }

  return { idx: getRootItemCount(), parentId: undefined }
}

export function useFormBuilderDragDrop(
  addItem: (key: string, index: number, parentId?: string) => void,
  reorderItems: (from: number, to: number, parentId?: string) => void,
  moveItem: (id: string, toParentId: string | undefined, toIndex: number) => void,
  getItemIndex: (id: string, parentId?: string) => number,
  getParentId: (id: string) => string | undefined,
  getRootItemCount: () => number,
) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragInsertIndex, setDragInsertIndex] = useState<number | null>(null)
  const [dragOverParentId, setDragOverParentId] = useState<string | undefined>(undefined)
  const lastDragOverRef = useRef<{ idx: number | null; parentId: string | undefined }>({
    idx: null,
    parentId: undefined,
  })

  const onDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id))
    lastDragOverRef.current = { idx: null, parentId: undefined }
  }, [])

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active } = event
      const from = active.data.current as DndItemData | undefined
      const result = computeInsertIndex(event, getItemIndex, getRootItemCount, getParentId)

      if (!result) {
        if (lastDragOverRef.current.idx !== null) {
          lastDragOverRef.current = { idx: null, parentId: undefined }
          setDragInsertIndex(null)
          setDragOverParentId(undefined)
        }
        return
      }

      // For canvas-item drags: skip the custom indicator on same-parent reorder
      // — dnd-kit's sortable preset handles the visual reorder animation.
      if (from?.kind === 'canvas-item') {
        const activeParent = getParentId(String(active.id))
        if (result.parentId === activeParent) {
          if (lastDragOverRef.current.idx !== null) {
            lastDragOverRef.current = { idx: null, parentId: undefined }
            setDragInsertIndex(null)
            setDragOverParentId(undefined)
          }
          return
        }
      }

      const prev = lastDragOverRef.current
      if (prev.idx === result.idx && prev.parentId === result.parentId) return

      lastDragOverRef.current = { idx: result.idx, parentId: result.parentId }
      setDragInsertIndex(result.idx)
      setDragOverParentId(result.parentId)
    },
    [getItemIndex, getRootItemCount, getParentId],
  )

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null)
      setDragInsertIndex(null)
      setDragOverParentId(undefined)
      lastDragOverRef.current = { idx: null, parentId: undefined }

      const { active, over } = event
      if (!over) return

      const from = active.data.current as DndItemData | undefined
      const to = over.data.current as DndItemData | undefined
      if (!from || !to) return

      const activeIdStr = String(active.id)

      // --- Toolbox → anything ---
      if (from.kind === 'toolbox-item') {
        const key = from.componentKey!

        if (to.kind === 'drop-indicator') {
          addItem(key, dragInsertIndex ?? 0)
          return
        }

        // Recompute the position using the same logic as onDragOver
        const pos = computeInsertIndex(
          event as unknown as DragOverEvent,
          getItemIndex,
          getRootItemCount,
        )
        addItem(key, pos?.idx ?? 0, pos?.parentId)
        return
      }

      // --- Canvas item (on root or in a container) → anything ---
      if (from.kind === 'canvas-item') {
        const fromParent = getParentId(activeIdStr)
        const overIdStr = String(over.id)

        // Reorder within the same parent
        if (to.kind === 'canvas-item') {
          const toParent = getParentId(overIdStr)
          if (fromParent === toParent) {
            const fromIdx = getItemIndex(activeIdStr, fromParent)
            const toIdx = getItemIndex(overIdStr, toParent)
            if (fromIdx >= 0 && toIdx >= 0 && fromIdx !== toIdx) {
              reorderItems(fromIdx, toIdx, fromParent)
            }
          } else {
            const pos = computeInsertIndex(
              event as unknown as DragOverEvent,
              getItemIndex,
              getRootItemCount,
              getParentId,
            )
            moveItem(activeIdStr, toParent, pos?.idx ?? 0)
          }
          return
        }

        // Dropped onto an inner container
        if (to.kind === 'container-dropzone') {
          moveItem(activeIdStr, to.containerId!, 0)
          return
        }

        // Dropped onto the root canvas — use stored indicator position if available
        moveItem(activeIdStr, undefined, dragInsertIndex ?? getRootItemCount())
        return
      }
    },
    [addItem, reorderItems, moveItem, getItemIndex, getParentId, getRootItemCount, dragInsertIndex],
  )

  return { activeId, dragInsertIndex, dragOverParentId, onDragStart, onDragOver, onDragEnd }
}
