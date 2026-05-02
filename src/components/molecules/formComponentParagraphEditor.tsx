import { FormComponentEditorContainer } from '../atoms/formComponentEditorContainer'
import { EditorTextArea } from './editorTextArea'
import { useEditorChange } from '../../utils/useEditorChange'
import type { EditorProps } from '../../types'

export function FormComponentParagraphEditor({ settings, onValueChange }: EditorProps) {
  const handleOnChange = useEditorChange(onValueChange)

  return (
    <FormComponentEditorContainer>
      <EditorTextArea settings={settings} name="content" label="Content" handleOnChange={handleOnChange} />
    </FormComponentEditorContainer>
  )
}
