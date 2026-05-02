import {
  TextField, Select, MenuItem, Typography, Checkbox, FormControlLabel,
  FormControl, InputLabel, RadioGroup, Radio, Switch, Box, Button,
} from '@mui/material'
import {
  FaHeading, FaParagraph, FaFont, FaList, FaCheckSquare,
  FaHashtag, FaCalendar, FaDotCircle, FaToggleOn, FaAlignLeft,
} from 'react-icons/fa'
import type { FormComponentRegistration, FormComponentProps, FormConfig } from 'fjorm'

export function FormWrapper({ children, onSubmit, ...rest }: Record<string, unknown> & { children?: React.ReactNode; onSubmit?: (data: Record<string, unknown>) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data: Record<string, unknown> = {}
    formData.forEach((value, key) => { data[key] = value })
    onSubmit?.(data)
  }

  return (
    <Box component="form" sx={{ maxWidth: 640, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={handleSubmit} {...rest}>
      {children}
      <Button type="submit" variant="contained" size="large">
        Submit
      </Button>
    </Box>
  )
}

// --- Display Components ---

function MuiHeader({ settings }: FormComponentProps) {
  return <Typography variant="h4" sx={{ mt: 2 }}>{settings.label}</Typography>
}

function MuiParagraph({ settings }: FormComponentProps) {
  return <Typography sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}>{(settings.content as string) ?? ''}</Typography>
}

function MuiTextInput({ settings, label }: FormComponentProps) {
  return (
    <TextField label={label} name={settings.name} fullWidth
      placeholder={(settings.placeholder as string) ?? ''}
      required={settings.required} />
  )
}

function MuiTextArea({ settings, label }: FormComponentProps) {
  return (
    <TextField label={label} name={settings.name} fullWidth multiline rows={4}
      placeholder={(settings.placeholder as string) ?? ''}
      required={settings.required} />
  )
}

function MuiNumber({ settings, label }: FormComponentProps) {
  return (
    <TextField label={label} name={settings.name} type="number" fullWidth
      placeholder={(settings.placeholder as string) ?? ''}
      required={settings.required} />
  )
}

function MuiSelect({ settings, label, options }: FormComponentProps) {
  return (
    <FormControl fullWidth required={settings.required}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} name={settings.name} defaultValue="">
        <MenuItem disabled value=""><em>Select...</em></MenuItem>
        {options?.map((opt) => (
          <MenuItem key={opt.id} value={opt.value}>{opt.title}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function MuiCheckbox({ settings, label }: FormComponentProps) {
  return (
    <FormControlLabel
      control={<Checkbox name={settings.name} required={settings.required} />}
      label={label}
    />
  )
}

function MuiRadio({ settings, label, options }: FormComponentProps) {
  return (
    <FormControl required={settings.required}>
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>{label}</Typography>
      <RadioGroup name={settings.name} row>
        {options?.map((opt) => (
          <FormControlLabel key={opt.id} value={opt.value} control={<Radio />} label={opt.title} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

function MuiDate({ settings, label }: FormComponentProps) {
  return (
    <TextField label={label} name={settings.name} type="date" fullWidth
      InputLabelProps={{ shrink: true }} required={settings.required} />
  )
}

function MuiSwitch({ settings, label }: FormComponentProps) {
  return (
    <FormControlLabel
      control={<Switch name={settings.name} />}
      label={label}
    />
  )
}

// --- Component Registry ---

export const formComponents: FormComponentRegistration[] = [
  {
    key: 'Header', icon: FaHeading,
    settings: { label: 'Header', name: 'Header' },
    component: MuiHeader,
    editor: { label: 'EditorInput' },
  },
  {
    key: 'Paragraph', icon: FaParagraph,
    settings: { label: 'Paragraph', content: 'Example text', name: 'Paragraph' },
    component: MuiParagraph,
    editor: { content: 'EditorTextArea' },
  },
  {
    key: 'TextInput', icon: FaFont,
    settings: { label: 'Text input', name: 'TextInput' },
    component: MuiTextInput,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'TextArea', icon: FaAlignLeft,
    settings: { label: 'Text area', name: 'TextArea' },
    component: MuiTextArea,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'NumberInput', icon: FaHashtag,
    settings: { label: 'Number', name: 'NumberInput' },
    component: MuiNumber,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'SelectInput', icon: FaList,
    options: [],
    settings: { label: 'Select', name: 'Select' },
    component: MuiSelect,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox', options: 'EditorOptions' },
  },
  {
    key: 'RadioGroup', icon: FaDotCircle,
    options: [],
    settings: { label: 'Radio group', name: 'RadioGroup' },
    component: MuiRadio,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox', options: 'EditorOptions' },
  },
  {
    key: 'Checkbox', icon: FaCheckSquare,
    settings: { label: 'Checkbox', name: 'Checkbox' },
    component: MuiCheckbox,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'DatePicker', icon: FaCalendar,
    settings: { label: 'Date', name: 'DatePicker' },
    component: MuiDate,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'Switch', icon: FaToggleOn,
    settings: { label: 'Toggle', name: 'Switch' },
    component: MuiSwitch,
    editor: { label: 'EditorInput', name: 'EditorInput' },
  },
]

export const formWrapper: FormConfig = {
  component: FormWrapper,
}
