import { useState, useCallback, type RefObject } from 'react'
import type { DragResult } from '../types'

interface PlaceholderProps {
  clientHeight: number
  clientWidth: number
  clientY: number
  clientX: number
}

export interface HandleDragEndConfig {
  sourceDroppableId: string
}

export function useDragDrop(containerRef: RefObject<HTMLElement | null>) {
  const [placeholderProps, setPlaceholderProps] = useState<PlaceholderProps | null>(null)

  const onDragUpdate = useCallback((update: {
    draggableId: string
    destination?: { index: number } | null
  }) => {
    if (!update.destination) return

    const draggableId = update.draggableId
    const destinationIndex = update.destination.index

    const container = containerRef.current
    if (!container) return

    const draggedDOM = container.querySelector(
      `[data-rbd-drag-handle-draggable-id="${draggableId.replace(/"/g, '\\"')}"]`
    ) as HTMLElement | null

    if (!draggedDOM) return

    const { clientHeight } = draggedDOM
    const { clientWidth } = container
    const containerStyles = window.getComputedStyle(container)

    const clientY = [...(container.children as unknown as HTMLElement[])]
      .slice(0, destinationIndex)
      .reduce((total, curr) => {
        const style = window.getComputedStyle(curr)
        const marginBottom = parseFloat(style.marginBottom)
        return total + curr.clientHeight + (isNaN(marginBottom) ? 0 : marginBottom)
      }, 0)

    setPlaceholderProps({
      clientHeight,
      clientWidth: clientWidth - parseFloat(containerStyles.paddingRight),
      clientY,
      clientX: 10,
    })
  }, [containerRef])

  return { placeholderProps, onDragUpdate }
}

export function applyDragEnd(
  d: DragResult,
  addItem: (key: string, index: number) => void,
  reorderItems: (from: number, to: number) => void,
  config?: HandleDragEndConfig,
): boolean {
  const sourceId = config?.sourceDroppableId ?? 'list'

  if (d.source.droppableId === sourceId && d.destination?.droppableId === sourceId) {
    return false
  }
  if (!d.destination) return false

  if (d.source.droppableId !== d.destination.droppableId) {
    if (d.source.droppableId !== sourceId) return false
    addItem(d.draggableId, d.destination.index)
  } else {
    reorderItems(d.source.index, d.destination.index)
  }

  return true
}
