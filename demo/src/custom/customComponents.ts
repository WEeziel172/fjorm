import {
  FaSlidersH, FaTags, FaPalette, FaMinus, FaStar,
} from 'react-icons/fa'
import type { FormComponentRegistration } from 'fjorm'
import SliderField from './fields/SliderField'
import TagInput from './fields/TagInput'
import ColorPickerField from './fields/ColorPickerField'
import DividerField from './fields/DividerField'
import RatingField from './fields/RatingField'
import TagInputEditor from './editors/TagInputEditor'

export const customComponents: FormComponentRegistration[] = [
  {
    key: 'Slider',
    icon: FaSlidersH,
    settings: { label: 'Slider', name: 'Slider', min: 0, max: 100, step: 1 },
    component: SliderField,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
      min: 'EditorInput',
      max: 'EditorInput',
      step: 'EditorInput',
    },
  },
  {
    key: 'TagInput',
    icon: FaTags,
    settings: { label: 'Tags', name: 'TagInput' },
    options: [
      { id: '1', title: 'React', value: 'react' },
      { id: '2', title: 'TypeScript', value: 'typescript' },
      { id: '3', title: 'Vite', value: 'vite' },
    ],
    component: TagInput,
    editor: TagInputEditor,
  },
  {
    key: 'ColorPicker',
    icon: FaPalette,
    settings: { label: 'Color', name: 'ColorPicker', value: '#4f46e5' },
    component: ColorPickerField,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
    },
  },
  {
    key: 'Divider',
    icon: FaMinus,
    settings: { label: 'Section', name: 'Divider' },
    component: DividerField,
    editor: { label: 'EditorInput' },
    providesValue: false,
  },
  {
    key: 'Rating',
    icon: FaStar,
    settings: { label: 'Rating', name: 'Rating', value: 0 },
    component: RatingField,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
    },
  },
]
