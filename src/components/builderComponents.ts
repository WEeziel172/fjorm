import { FaHeading, FaParagraph, FaFont, FaList } from 'react-icons/fa'
import { FormComponentHeaderEditor } from './molecules/formComponentHeaderEditor'
import { FormComponentParagraphEditor } from './molecules/formComponentParagraphEditor'
import { FormComponentSelectEditor } from './molecules/formComponentSelectEditor'
import { FormComponentSelect } from './organisms/formComponentSelect'
import { FormComponentInput } from './organisms/formComponentInput'
import { FormComponentParagraph } from './molecules/formComponentParagraph'
import { FormComponentHeader } from './atoms/formComponentHeader'
import type { FormComponentRegistration } from '../types'

export const formComponents: FormComponentRegistration[] = [
  {
    key: 'Header',
    settings: { label: 'Header', name: 'Header' },
    icon: FaHeading,
    component: FormComponentHeader,
    editor: FormComponentHeaderEditor,
    providesValue: false,
  },
  {
    key: 'Paragraph',
    settings: { label: 'Paragraph', content: 'Example paragraph', name: 'Paragraph' },
    icon: FaParagraph,
    component: FormComponentParagraph,
    editor: FormComponentParagraphEditor,
    providesValue: false,
  },
  {
    key: 'TextInput',
    icon: FaFont,
    settings: { label: 'Text input', name: 'TextInput' },
    component: FormComponentInput,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
    },
  },
  {
    key: 'SelectInput',
    icon: FaList,
    options: [],
    settings: { label: 'Select', name: 'Select' },
    component: FormComponentSelect,
    editor: FormComponentSelectEditor,
  },
]
