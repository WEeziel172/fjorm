import { FormComponentEditorContainer } from '../atoms/formComponentEditorContainer'
import { EditorInput } from './editorInput'
import { useEditorChange } from '../../utils/useEditorChange'
import type { EditorProps } from '../../types'

export function FormComponentHeaderEditor({ settings, onValueChange }: EditorProps) {
  const handleOnChange = useEditorChange(onValueChange)

  return (
    <FormComponentEditorContainer>
      <EditorInput settings={settings} name="label" label="Header" handleOnChange={handleOnChange} />
    </FormComponentEditorContainer>
  )
}
