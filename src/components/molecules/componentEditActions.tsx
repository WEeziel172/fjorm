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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M10.5 1.5L12.5 3.5L4.5 11.5H2.5V9.5L10.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 13H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>
      <button type="button" aria-label="Delete" onClick={() => onDelete({ id })}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 4H12M5 4V2.5C5 2.22386 5.22386 2 5.5 2H8.5C8.77614 2 9 2.22386 9 2.5V4M11 4V12.5C11 12.7761 10.7761 13 10.5 13H3.5C3.22386 13 3 12.7761 3 12.5V4H11Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
