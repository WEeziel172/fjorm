import { FaEdit, FaTrash } from 'react-icons/fa'

export function ComponentEditActions({
  onEdit,
  onDelete,
  id,
}: {
  onEdit: (payload: { id: string }) => void
  onDelete: (payload: { id: string }) => void
  id: string
}) {
  return (
    <div className="form-component-actions">
      <button type="button" aria-label="Edit" onClick={() => onEdit({ id })}>
        <FaEdit aria-hidden="true" />
      </button>
      <button type="button" aria-label="Delete" onClick={() => onDelete({ id })}>
        <FaTrash aria-hidden="true" />
      </button>
    </div>
  )
}
