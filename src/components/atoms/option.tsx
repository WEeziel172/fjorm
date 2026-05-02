interface OnChangePayload {
  event: { target: { value: string } }
  id: string
  name: string
}

export function Option({
  value,
  title,
  id,
  onChange,
  onDelete,
}: {
  value: string
  title: string
  id: string
  onChange: (payload: OnChangePayload) => void
  onDelete: (payload: { id: string }) => void
}) {
  return (
    <div className="form-item">
      <input
        aria-label="Option value"
        style={{ width: '40%' }}
        onChange={(event) => onChange({ event, id, name: 'value' })}
        value={value}
        placeholder="Value"
      />
      <input
        aria-label="Option title"
        style={{ width: '40%' }}
        onChange={(event) => onChange({ event, id, name: 'title' })}
        value={title}
        placeholder="Title"
      />
      <button
        type="button"
        aria-label="Delete option"
        style={{ width: '5%', cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit' }}
        onClick={() => onDelete({ id })}
      >
        x
      </button>
    </div>
  )
}
