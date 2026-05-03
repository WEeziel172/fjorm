import type { ComponentType } from 'react'
import { FormComponentHeaderEditor } from './molecules/formComponentHeaderEditor'
import { FormComponentParagraphEditor } from './molecules/formComponentParagraphEditor'
import { FormComponentSelectEditor } from './molecules/formComponentSelectEditor'
import { FormComponentSelect } from './organisms/formComponentSelect'
import { FormComponentInput } from './organisms/formComponentInput'
import { FormComponentParagraph } from './molecules/formComponentParagraph'
import { FormComponentHeader } from './atoms/formComponentHeader'
import type { FormComponentRegistration } from '../types'

function SvgIcon({
  children,
  viewBox = '0 0 16 16',
}: {
  children: React.ReactNode
  viewBox?: string
}) {
  const Icon: ComponentType = () => (
    <svg width="16" height="16" viewBox={viewBox} fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  )
  return Icon
}

const HeaderIcon: ComponentType = SvgIcon({
  children: (
    <path d="M3 2v12M3 8h10M13 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  ),
})

const ParagraphIcon: ComponentType = SvgIcon({
  children: (
    <>
      <rect x="2" y="3" width="12" height="2" rx="1" />
      <rect x="2" y="7" width="9" height="2" rx="1" />
      <rect x="2" y="11" width="10" height="2" rx="1" />
    </>
  ),
})

const TextInputIcon: ComponentType = SvgIcon({
  children: (
    <>
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M5 6h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
})

const SelectInputIcon: ComponentType = SvgIcon({
  children: (
    <>
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M5 9L8 6L11 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
})

export const formComponents: FormComponentRegistration[] = [
  {
    key: 'Header',
    settings: { label: 'Header', name: 'Header' },
    icon: HeaderIcon,
    component: FormComponentHeader,
    editor: FormComponentHeaderEditor,
    providesValue: false,
  },
  {
    key: 'Paragraph',
    settings: { label: 'Paragraph', content: 'Example paragraph', name: 'Paragraph' },
    icon: ParagraphIcon,
    component: FormComponentParagraph,
    editor: FormComponentParagraphEditor,
    providesValue: false,
  },
  {
    key: 'TextInput',
    icon: TextInputIcon,
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
    icon: SelectInputIcon,
    options: [],
    settings: { label: 'Select', name: 'Select' },
    component: FormComponentSelect,
    editor: FormComponentSelectEditor,
  },
]
