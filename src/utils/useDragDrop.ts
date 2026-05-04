import { useState, useCallback } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { DndItemData } from '../types'

export function useFormBuilderDragDrop(
  addItem: (key: string, index: number, parentId?: string) => void,
  reorderItems: (from: number, to: number, parentId?: string) => void,
  moveItem: (id: string, toParentId: string | undefined, toIndex: number) => void,
  getItemIndex: (id: string, parentId?: string) => number,
  getParentId: (id: string) => string | undefined,
  getRootItemCount: () => number,
) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const onDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }, [])

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event
      if (!over) return

      const from = active.data.current as DndItemData | undefined
      const to = over.data.current as DndItemData | undefined
      if (!from || !to) return

      const activeIdStr = String(active.id)
      const overIdStr = String(over.id)

      // --- Toolbox → anything ---
      if (from.kind === 'toolbox-item') {
        const key = from.componentKey!
        if (to.kind === 'canvas-item') {
          const idx = getItemIndex(overIdStr)
          addItem(key, idx >= 0 ? idx : 0)
        } else if (to.kind === 'container-dropzone') {
          addItem(key, 0, to.containerId!)
        } else {
          addItem(key, getRootItemCount())
        }
        return
      }

      // --- Canvas item (on root or in a container) → anything ---
      if (from.kind === 'canvas-item') {
        const fromParent = getParentId(activeIdStr)

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
            // Move to a different parent, inserting at the target item's position
            moveItem(activeIdStr, toParent, getItemIndex(overIdStr, toParent))
          }
          return
        }

        // Dropped onto an inner container
        if (to.kind === 'container-dropzone') {
          moveItem(activeIdStr, to.containerId!, 0)
          return
        }

        // Dropped onto the root canvas
        moveItem(activeIdStr, undefined, getRootItemCount())
        return
      }
    },
    [addItem, reorderItems, moveItem, getItemIndex, getParentId, getRootItemCount],
  )

  return { activeId, onDragStart, onDragEnd }
}
