import { useOptionsManager } from '../../utils/useOptionsManager'
import { Option } from '../atoms/option'
import type { FormComponentOption, EditorChangePayload } from '../../types'

export function EditorOptions({
  label,
  name = '',
  handleOnChangeOptions,
  options: currOptions,
}: {
  label: string
  name?: string
  handleOnChange: (payload: EditorChangePayload) => void
  handleOnChangeOptions?: (payload: { name: string; options: FormComponentOption[] }) => void
  options?: FormComponentOption[]
}) {
  const { options, addOption, editOption, deleteOption } = useOptionsManager(
    currOptions,
    name,
    handleOnChangeOptions,
  )

  return (
    <>
      <div className="form-item">
        <label>{label}</label>
        <button type="button" className="add-option-btn" onClick={addOption}>
          Add
        </button>
      </div>
      {options.length > 0 &&
        options.map((option) => (
          <Option
            id={option.id}
            key={option.id}
            onDelete={({ id }) => deleteOption(id)}
            value={option.value}
            title={option.title}
            onChange={({ id, event, name: fieldName }) =>
              editOption(id, fieldName, event.target.value)
            }
          />
        ))}
    </>
  )
}
