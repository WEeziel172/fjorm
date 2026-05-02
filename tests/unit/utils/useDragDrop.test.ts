import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createRef } from 'react'
import { useDragDrop, applyDragEnd } from '../../../src/utils/useDragDrop'

describe('useDragDrop', () => {
  it('initializes with null placeholderProps', () => {
    const ref = createRef<HTMLDivElement>()
    const { result } = renderHook(() => useDragDrop(ref))

    expect(result.current.placeholderProps).toBeNull()
  })

  it('onDragUpdate no-ops when no destination', () => {
    const ref = createRef<HTMLDivElement>()
    const { result } = renderHook(() => useDragDrop(ref))

    act(() => {
      result.current.onDragUpdate({ draggableId: 'x', destination: null })
    })

    expect(result.current.placeholderProps).toBeNull()
  })

  it('computes placeholderProps when container has children and destination is provided', () => {
    const container = document.createElement('div')
    const child = document.createElement('div')
    child.setAttribute('data-rbd-drag-handle-draggable-id', 'test-id')
    Object.defineProperty(child, 'clientHeight', { value: 50, configurable: true })
    Object.defineProperty(container, 'clientWidth', { value: 400, configurable: true })
    container.appendChild(child)
    document.body.appendChild(container)

    const ref = { current: container }
    const { result } = renderHook(() => useDragDrop(ref))

    act(() => {
      result.current.onDragUpdate({
        draggableId: 'test-id',
        destination: { index: 0 },
      })
    })

    expect(result.current.placeholderProps).not.toBeNull()
    expect(result.current.placeholderProps?.clientHeight).toBe(50)

    document.body.removeChild(container)
  })
})

describe('applyDragEnd', () => {
  it('returns false when dragging within toolbox', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'x', source: { droppableId: 'list', index: 0 }, destination: { droppableId: 'list', index: 1 } },
      addItem,
      reorderItems,
    )

    expect(changed).toBe(false)
    expect(addItem).not.toHaveBeenCalled()
    expect(reorderItems).not.toHaveBeenCalled()
  })

  it('returns false when destination is null', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'x', source: { droppableId: 'list', index: 0 }, destination: null },
      addItem,
      reorderItems,
    )

    expect(changed).toBe(false)
  })

  it('adds item when dragging from toolbox to canvas', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'Header', source: { droppableId: 'list', index: 0 }, destination: { droppableId: 'a', index: 0 } },
      addItem,
      reorderItems,
    )

    expect(changed).toBe(true)
    expect(addItem).toHaveBeenCalledWith('Header', 0)
  })

  it('reorders when dragging within canvas', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'x', source: { droppableId: 'a', index: 0 }, destination: { droppableId: 'a', index: 2 } },
      addItem,
      reorderItems,
    )

    expect(changed).toBe(true)
    expect(reorderItems).toHaveBeenCalledWith(0, 2)
  })

  it('does nothing when dragging from canvas to toolbox', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'x', source: { droppableId: 'a', index: 0 }, destination: { droppableId: 'list', index: 0 } },
      addItem,
      reorderItems,
    )

    expect(changed).toBe(false)
    expect(addItem).not.toHaveBeenCalled()
    expect(reorderItems).not.toHaveBeenCalled()
  })

  it('uses custom sourceDroppableId', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'TextInput', source: { droppableId: 'custom-toolbox', index: 0 }, destination: { droppableId: 'custom-canvas', index: 2 } },
      addItem,
      reorderItems,
      { sourceDroppableId: 'custom-toolbox' },
    )

    expect(changed).toBe(true)
    expect(addItem).toHaveBeenCalledWith('TextInput', 2)
  })

  it('reorders within custom canvas droppableId', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'x', source: { droppableId: 'my-canvas', index: 1 }, destination: { droppableId: 'my-canvas', index: 3 } },
      addItem,
      reorderItems,
      { sourceDroppableId: 'my-toolbox' },
    )

    expect(changed).toBe(true)
    expect(reorderItems).toHaveBeenCalledWith(1, 3)
  })

  it('returns false when dragging from unknown source with custom IDs', () => {
    const addItem = vi.fn()
    const reorderItems = vi.fn()

    const changed = applyDragEnd(
      { draggableId: 'x', source: { droppableId: 'somewhere-else', index: 0 }, destination: { droppableId: 'custom-canvas', index: 0 } },
      addItem,
      reorderItems,
      { sourceDroppableId: 'custom-toolbox' },
    )

    expect(changed).toBe(false)
    expect(addItem).not.toHaveBeenCalled()
  })
})
