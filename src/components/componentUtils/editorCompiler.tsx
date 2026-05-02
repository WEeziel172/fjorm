import { useMemo } from 'react'
import { useEditorChange } from '../../utils/useEditorChange'
import { EditorInput } from '../molecules/editorInput'
import { EditorCheckbox } from '../molecules/editorCheckbox'
import { EditorTextArea } from '../molecules/editorTextArea'
import { EditorOptions } from '../molecules/editorOptions'
import { FormComponentEditorContainer } from '../atoms/formComponentEditorContainer'
import type { FormComponentSettings, FormComponentOption, EditorChangePayload, EditorFieldMap } from '../../types'

function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .replace(/[_-]/g, ' ')
    .trim()
}

function GetEditor({
  fieldKey,
  ...rest
}: {
  fieldKey: string
  label: string
  name: string
  handleOnChange: (payload: EditorChangePayload) => void
  settings: FormComponentSettings
  options?: FormComponentOption[]
  handleOnChangeOptions?: (payload: { name: string; options: FormComponentOption[] }) => void
}) {
  switch (fieldKey) {
    case 'EditorInput':
      return <EditorInput {...rest} />
    case 'EditorCheckbox':
      return <EditorCheckbox {...rest} />
    case 'EditorTextArea':
      return <EditorTextArea {...rest} />
    case 'EditorOptions':
      return <EditorOptions {...rest} />
    default:
      if (typeof fieldKey === 'string') {
        console.warn(`[fjorm] Unknown editor component "${fieldKey}" in EditorFieldMap — falling back to EditorInput`)
      }
      return <EditorInput {...rest} />
  }
}

export function EditorCompiler({
  editor: editorObj,
  onValueChange,
  settings,
  options,
  onChangeOptions,
}: {
  editor: EditorFieldMap
  onValueChange: (payload: { name: string; value: unknown }) => void
  settings: FormComponentSettings
  formItemId: string
  options?: FormComponentOption[]
  onChangeOptions?: (payload: { name: string; options: FormComponentOption[] }) => void
}) {
  const handleOnChange = useEditorChange(onValueChange)

  const components = useMemo(() => {
    const keys = Object.keys(editorObj)

    return keys.map((key) => {
      const label = toLabel(key)
      return (
        <GetEditor
          key={key}
          label={label}
          handleOnChange={handleOnChange}
          fieldKey={editorObj[key]}
          name={key}
          settings={settings}
          options={options}
          handleOnChangeOptions={onChangeOptions}
        />
      )
    })
  }, [editorObj, settings, options, onChangeOptions, handleOnChange])

  return <FormComponentEditorContainer>{components}</FormComponentEditorContainer>
}
