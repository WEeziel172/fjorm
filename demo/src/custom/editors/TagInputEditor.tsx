import { EditorInput, EditorOptions, FormComponentEditorContainer, useEditorChange } from 'fjorm'
import type { EditorProps } from 'fjorm'

export default function TagInputEditor({ settings, options, onValueChange, onChangeOptions }: EditorProps) {
  const handleOnChange = useEditorChange(onValueChange)

  return (
    <FormComponentEditorContainer>
      <EditorInput settings={settings} name="label" label="Label" handleOnChange={handleOnChange} />
      <EditorInput settings={settings} name="name" label="Field name" handleOnChange={handleOnChange} />
      <EditorOptions
        options={options}
        name="options"
        label="Suggestions"
        handleOnChange={handleOnChange}
        handleOnChangeOptions={onChangeOptions ?? (() => {})}
      />
    </FormComponentEditorContainer>
  )
}
