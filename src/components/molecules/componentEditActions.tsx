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
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 1.5L14.5 4L4.5 14H2v-2.5L12 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 15h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
      <button type="button" aria-label="Delete" onClick={() => onDelete({ id })}>
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2.5 4.5h11M5.5 4.5V3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1.5M11.5 4.5v9a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5v-9h7Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
