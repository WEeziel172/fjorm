import { FormComponentEditorContainer } from '../atoms/formComponentEditorContainer'
import { EditorCheckbox } from './editorCheckbox'
import { EditorOptions } from './editorOptions'
import { EditorInput } from './editorInput'
import { useEditorChange } from '../../utils/useEditorChange'
import type { EditorProps } from '../../types'

const noop = () => {}

export function FormComponentSelectEditor({
  settings,
  options,
  onValueChange,
  onChangeOptions,
}: EditorProps) {
  const handleOnChange = useEditorChange(onValueChange)

  return (
    <FormComponentEditorContainer>
      <EditorInput settings={settings} name="label" label="Label" handleOnChange={handleOnChange} />
      <EditorInput settings={settings} name="name" label="Field name" handleOnChange={handleOnChange} />
      <EditorCheckbox settings={settings} name="required" label="Required" handleOnChange={handleOnChange} />
      <EditorOptions
        options={options}
        name="options"
        label="Options"
        handleOnChange={handleOnChange}
        handleOnChangeOptions={onChangeOptions ?? noop}
      />
    </FormComponentEditorContainer>
  )
}
