import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormBuilderDragDrop } from '../../../src/utils/useDragDrop'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'

const DEFAULT_RECT = { top: 0, left: 0, right: 100, bottom: 50, width: 100, height: 50 }

function makeEvent(
  active: { id: string; kind: string; componentKey?: string },
  over: { id: string; kind: string; containerId?: string } | null,
  pointerY = 0,
): DragEndEvent {
  return {
    active: {
      id: active.id,
      data: { current: { kind: active.kind, componentKey: active.componentKey } },
    },
    over: over
      ? { id: over.id, rect: DEFAULT_RECT, disabled: false, data: { current: { kind: over.kind, containerId: over.containerId } } }
      : null,
    collisions: [],
    delta: { x: 0, y: pointerY },
    activatorEvent: new MouseEvent('pointerup', { clientY: 0 }),
  } as unknown as DragEndEvent
}

function makeStartEvent(id: string): { active: { id: string } } {
  return { active: { id } } as unknown as { active: { id: string } }
}

function makeDragOverEvent(
  active: { id: string; kind: string; componentKey?: string },
  over: { id: string; kind: string; containerId?: string } | null,
  pointerY = 0,
): DragOverEvent {
  return {
    active: {
      id: active.id,
      data: { current: { kind: active.kind, componentKey: active.componentKey } },
    },
    over: over
      ? { id: over.id, rect: DEFAULT_RECT, disabled: false, data: { current: { kind: over.kind, containerId: over.containerId } } }
      : null,
    collisions: [],
    delta: { x: 0, y: pointerY },
    activatorEvent: new MouseEvent('pointermove', { clientY: 0 }),
  } as unknown as DragOverEvent
}

describe('useFormBuilderDragDrop', () => {
  const noop = () => undefined
  const negOne = () => -1
  const zero = () => 0

  it('initializes with null activeId', () => {
    const { result } = renderHook(() =>
      useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), negOne, noop, zero),
    )
    expect(result.current.activeId).toBeNull()
    expect(result.current.dragInsertIndex).toBeNull()
  })

  it('onDragStart sets activeId', () => {
    const { result } = renderHook(() =>
      useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), negOne, noop, zero),
    )

    act(() => {
      result.current.onDragStart(makeStartEvent('test-id') as Parameters<typeof result.current.onDragStart>[0])
    })
    expect(result.current.activeId).toBe('test-id')
  })

  describe('onDragOver', () => {
    it('inserts before item when pointer above center', () => {
      const getItemIndex = vi.fn((id: string) => (id === 'item2' ? 1 : -1))
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), getItemIndex, noop, zero),
      )

      // pointerY=0, centerY=25 → pointer above center → insert before
      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'item2', kind: 'canvas-item' },
          0,
        ))
      })

      expect(result.current.dragInsertIndex).toBe(1)
    })

    it('inserts after item when pointer below center', () => {
      const getItemIndex = vi.fn((id: string) => (id === 'item2' ? 1 : -1))
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), getItemIndex, noop, zero),
      )

      // pointerY=30, centerY=25 → pointer below center → insert after
      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'item2', kind: 'canvas-item' },
          30,
        ))
      })

      expect(result.current.dragInsertIndex).toBe(2)
    })

    it('sets insertion index to 0 for container dropzone', () => {
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), negOne, noop, zero),
      )

      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'container-abc', kind: 'container-dropzone', containerId: 'abc' },
        ))
      })

      expect(result.current.dragInsertIndex).toBe(0)
      expect(result.current.dragOverParentId).toBe('abc')
    })

    it('appends at end when over canvas-root', () => {
      const getRootItemCount = vi.fn(() => 3)
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), negOne, noop, getRootItemCount),
      )

      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'fjorm-canvas', kind: 'canvas-root' },
        ))
      })

      expect(result.current.dragInsertIndex).toBe(3)
    })

    it('clears insertion index when over is null', () => {
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), negOne, noop, zero),
      )

      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          null,
        ))
      })

      expect(result.current.dragInsertIndex).toBeNull()
    })

    it('skips indicator for same-parent canvas-item reorder', () => {
      const getParentId = vi.fn(() => undefined)
      const getItemIndex = vi.fn((id: string) => (id === 'item2' ? 1 : -1))
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), getItemIndex, getParentId, zero),
      )

      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'item1', kind: 'canvas-item' },
          { id: 'item2', kind: 'canvas-item' },
        ))
      })

      expect(result.current.dragInsertIndex).toBeNull()
    })

    it('sets insertion index for cross-parent canvas-item drag', () => {
      const getParentId = vi.fn((id: string) => (id === 'item1' ? 'container-a' : undefined))
      const getItemIndex = vi.fn((id: string) => (id === 'item2' ? 0 : -1))
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), vi.fn(), getItemIndex, getParentId, zero),
      )

      // pointerY=30, centerY=25 → below center → insert after → idx=1
      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'item1', kind: 'canvas-item' },
          { id: 'item2', kind: 'canvas-item' },
          30,
        ))
      })

      expect(result.current.dragInsertIndex).toBe(1)
      expect(result.current.dragOverParentId).toBeUndefined()
    })
  })

  describe('onDragEnd', () => {
    it('clears activeId and dragInsertIndex on drag end', () => {
      const addItem = vi.fn()
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(addItem, vi.fn(), vi.fn(), negOne, noop, zero),
      )
      act(() => {
        result.current.onDragStart(makeStartEvent('test-id') as Parameters<typeof result.current.onDragStart>[0])
      })
      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'test', kind: 'toolbox-item', componentKey: 'Header' },
          { id: 'item1', kind: 'canvas-item' },
        ))
      })
      expect(result.current.activeId).toBeNull()
      expect(result.current.dragInsertIndex).toBeNull()
    })

    it('adds item when dragging from toolbox to canvas (pointer above center)', () => {
      const addItem = vi.fn()
      const reorderItems = vi.fn()
      const moveItem = vi.fn()
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(addItem, reorderItems, moveItem, () => 0, noop, zero),
      )

      // pointerY=0, centerY=25 → above center → insert before → idx=0
      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'item1', kind: 'canvas-item' },
          0,
        ))
      })

      expect(addItem).toHaveBeenCalledWith('TextInput', 0, undefined)
    })

    it('adds item after last item when pointer below center', () => {
      const addItem = vi.fn()
      const getItemIndex = vi.fn(() => 2)
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(addItem, vi.fn(), vi.fn(), getItemIndex, noop, zero),
      )

      // pointerY=30, centerY=25 → below center → insert after → idx=2+1=3
      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'item3', kind: 'canvas-item' },
          30,
        ))
      })

      expect(addItem).toHaveBeenCalledWith('TextInput', 3, undefined)
    })

    it('adds item to container when dropping from toolbox into container', () => {
      const addItem = vi.fn()
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(addItem, vi.fn(), vi.fn(), negOne, noop, zero),
      )

      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'container-abc', kind: 'container-dropzone', containerId: 'abc' },
        ))
      })

      expect(addItem).toHaveBeenCalledWith('TextInput', 0, 'abc')
    })

    it('handles drop-indicator kind by using tracked dragInsertIndex', () => {
      const addItem = vi.fn()
      const getItemIndex = vi.fn(() => 2)
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(addItem, vi.fn(), vi.fn(), getItemIndex, noop, zero),
      )

      // pointerY=0, centerY=25 → above center → insert before → idx=2
      act(() => {
        result.current.onDragOver(makeDragOverEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'item3', kind: 'canvas-item' },
          0,
        ))
      })

      expect(result.current.dragInsertIndex).toBe(2)

      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: '__fjorm-drag-placeholder__', kind: 'drop-indicator' },
        ))
      })

      expect(addItem).toHaveBeenCalledWith('TextInput', 2)
    })

    it('reorders when dragging canvas item over another canvas item', () => {
      const reorderItems = vi.fn()
      const getItemIndex = vi.fn((id: string) => (id === 'item1' ? 0 : id === 'item2' ? 2 : -1))
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), reorderItems, vi.fn(), getItemIndex, noop, zero),
      )

      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'item1', kind: 'canvas-item' },
          { id: 'item2', kind: 'canvas-item' },
        ))
      })

      expect(reorderItems).toHaveBeenCalledWith(0, 2, undefined)
    })

    it('no-ops when over is null', () => {
      const addItem = vi.fn()
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(addItem, vi.fn(), vi.fn(), negOne, noop, zero),
      )

      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          null,
        ))
      })

      expect(addItem).not.toHaveBeenCalled()
    })

    it('moves canvas item cross-parent with Y-based positioning', () => {
      const moveItem = vi.fn()
      const getParentId = vi.fn((id: string) =>
        id === 'child1' ? 'container-a' : undefined,
      )
      const getItemIndex = vi.fn((id: string) => (id === 'item2' ? 1 : -1))
      const getRootItemCount = vi.fn(() => 3)
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(
          vi.fn(),
          vi.fn(),
          moveItem,
          getItemIndex,
          getParentId,
          getRootItemCount,
        ),
      )

      // Drag child1 (inside container-a) over item2 (root, pointerY=0 → above center)
      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'child1', kind: 'canvas-item' },
          { id: 'item2', kind: 'canvas-item' },
          0,
        ))
      })

      // Index 1 = before item2 (pointer above center)
      expect(moveItem).toHaveBeenCalledWith('child1', undefined, 1)
    })

    it('moves item from canvas to container', () => {
      const moveItem = vi.fn()
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(vi.fn(), vi.fn(), moveItem, negOne, noop, zero),
      )

      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'child1', kind: 'canvas-item' },
          { id: 'container-xyz', kind: 'container-dropzone', containerId: 'xyz' },
        ))
      })

      expect(moveItem).toHaveBeenCalledWith('child1', 'xyz', 0)
    })
  })
})
