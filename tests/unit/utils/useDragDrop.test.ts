import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormBuilderDragDrop } from '../../../src/utils/useDragDrop'
import type { DragEndEvent } from '@dnd-kit/core'

function makeEvent(active: { id: string; kind: string; componentKey?: string }, over: { id: string; kind: string; containerId?: string } | null): DragEndEvent {
  return {
    active: { id: active.id, data: { current: { kind: active.kind, componentKey: active.componentKey } } },
    over: over ? { id: over.id, data: { current: { kind: over.kind, containerId: over.containerId } } } : null,
    collisions: [],
    delta: { x: 0, y: 0 },
    activatorEvent: new Event('pointerup') as unknown as PointerEvent,
  } as unknown as DragEndEvent
}

function makeStartEvent(id: string): { active: { id: string } } {
  return { active: { id } } as unknown as { active: { id: string } }
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

  describe('onDragEnd', () => {
    it('clears activeId on drag end', () => {
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
    })

    it('adds item when dragging from toolbox to canvas', () => {
      const addItem = vi.fn()
      const reorderItems = vi.fn()
      const moveItem = vi.fn()
      const { result } = renderHook(() =>
        useFormBuilderDragDrop(addItem, reorderItems, moveItem, () => 0, noop, zero),
      )

      act(() => {
        result.current.onDragEnd(makeEvent(
          { id: 'TextInput', kind: 'toolbox-item', componentKey: 'TextInput' },
          { id: 'item1', kind: 'canvas-item' },
        ))
      })

      expect(addItem).toHaveBeenCalledWith('TextInput', 0, undefined)
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

      expect(reorderItems).toHaveBeenCalledWith(0, 2)
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
