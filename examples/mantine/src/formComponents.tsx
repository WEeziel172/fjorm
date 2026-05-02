import { useState } from 'react'
import {
  TextInput, Textarea, Select, NumberInput, Checkbox, Radio, Switch,
  Title, Text, Container, Button, Box, Group, Badge, ActionIcon, Flex,
} from '@mantine/core'
import {
  FaHeading, FaParagraph, FaFont, FaList, FaCheckSquare,
  FaHashtag, FaCalendar, FaDotCircle, FaToggleOn, FaAlignLeft, FaExchangeAlt,
} from 'react-icons/fa'
import {
  EditorInput, EditorOptions, FormComponentEditorContainer, useEditorChange,
  type FormComponentRegistration, type FormComponentProps, type FormConfig, type EditorProps,
} from 'fjorm'

export function FormWrapper({ children, onSubmit, fjormValues, ...rest }: Record<string, unknown> & {
  children?: React.ReactNode
  onSubmit?: (data: Record<string, unknown>) => void
  fjormValues?: Record<string, unknown>
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data: Record<string, unknown> = {}

    // Collect native input values
    formData.forEach((value, key) => { data[key] = value })

    // Overlay values from complex components (onChangeValue callbacks)
    if (fjormValues) {
      Object.entries(fjormValues).forEach(([key, value]) => {
        data[key] = value
      })
    }

    onSubmit?.(data)
  }

  return (
    <Box component="form" {...rest} onSubmit={handleSubmit}>
      <Container size="sm" py="xl">
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {children}
          <Button type="submit" size="md" mt="md">
            Submit
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// --- Display Components ---

function MantineHeader({ settings }: FormComponentProps) {
  return <Title order={2} mt="lg">{settings.label}</Title>
}

function MantineParagraph({ settings }: FormComponentProps) {
  return <Text style={{ whiteSpace: 'pre-line' }} c="dimmed">{(settings.content as string) ?? ''}</Text>
}

function MantineTextInput({ settings, label }: FormComponentProps) {
  return (
    <TextInput label={label} name={settings.name}
      placeholder={(settings.placeholder as string) ?? ''}
      required={settings.required} />
  )
}

function MantineTextArea({ settings, label }: FormComponentProps) {
  return (
    <Textarea label={label} name={settings.name} minRows={4}
      placeholder={(settings.placeholder as string) ?? ''}
      required={settings.required} />
  )
}

function MantineNumber({ settings, label }: FormComponentProps) {
  return (
    <NumberInput label={label} name={settings.name}
      placeholder={(settings.placeholder as string) ?? ''}
      required={settings.required} />
  )
}

function MantineSelect({ settings, label, options }: FormComponentProps) {
  return (
    <Select label={label} name={settings.name} placeholder="Select..."
      required={settings.required}
      data={options?.map((opt) => ({ value: opt.value, label: opt.title })) ?? []} />
  )
}

function MantineCheckbox({ settings, label }: FormComponentProps) {
  return (
    <Checkbox label={label} name={settings.name} required={settings.required} />
  )
}

function MantineRadio({ settings, label, options }: FormComponentProps) {
  return (
    <Radio.Group label={label} name={settings.name} required={settings.required}>
      <Group mt="xs">
        {options?.map((opt) => (
          <Radio key={opt.id} value={opt.value} label={opt.title} />
        ))}
      </Group>
    </Radio.Group>
  )
}

function MantineDate({ settings, label }: FormComponentProps) {
  return (
    <TextInput label={label} name={settings.name} type="date"
      required={settings.required} />
  )
}

function MantineSwitch({ settings, label }: FormComponentProps) {
  return (
    <Switch label={label} name={settings.name} />
  )
}

// --- Component Registry ---

// --- Complex component: ListSwitcher ---
// Uses onChangeValue to push an array of selected IDs up to the form.
// Available items come from `options` (configured via EditorOptions in the sidebar).
// onChangeValue bypasses FormData, which only captures native inputs.
//
// To configure the items: the editor key in the registration includes "options",
// which renders the EditorOptions component in the sidebar. Users add/edit/remove
// items there, and they're stored in FormComponentRegistration.options.

function ListSwitcher({ settings, options, value, onChangeValue }: FormComponentProps) {
  const initialSelected: string[] = Array.isArray(value) ? value as string[] : []
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected))

  const items = options ?? []
  const available = items.filter((item) => !selected.has(item.id))
  const selectedItems = items.filter((item) => selected.has(item.id))

  function moveToSelected(id: string) {
    const next = new Set(selected)
    next.add(id)
    setSelected(next)
    onChangeValue?.(Array.from(next))
  }

  function moveToAvailable(id: string) {
    const next = new Set(selected)
    next.delete(id)
    setSelected(next)
    onChangeValue?.(Array.from(next))
  }

  return (
    <Box mb="md">
      <Text fw={500} fz="sm" mb="xs">{settings.label}</Text>
      <Flex gap="md" align="flex-start">
        <Box style={{ flex: 1 }}>
          <Text fz="xs" c="dimmed" mb="xs">Available</Text>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {available.map((item) => (
              <Badge key={item.id} variant="light" color="gray"
                style={{ cursor: 'pointer' }}
                onClick={() => moveToSelected(item.id)}
                rightSection={<Text fz="xs" c="dimmed">+</Text>}>
                {item.title}
              </Badge>
            ))}
          </Box>
        </Box>
        <Box style={{ flex: 1 }}>
          <Text fz="xs" c="dimmed" mb="xs">Selected</Text>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {selectedItems.map((item) => (
              <Badge key={item.id} variant="light" color="blue"
                style={{ cursor: 'pointer' }}
                onClick={() => moveToAvailable(item.id)}
                rightSection={<Text fz="xs" c="dimmed">x</Text>}>
                {item.title}
              </Badge>
            ))}
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

// --- Custom editor for ListSwitcher ---
// Composed from Fjorm editor primitives instead of the declarative object form.
// Use this pattern when you need custom layout, validation, or conditional fields
// beyond what the declarative { label: 'EditorInput', ... } approach supports.

function ListSwitcherEditor({ settings, options, onValueChange, onChangeOptions }: EditorProps) {
  const handleOnChange = useEditorChange(onValueChange)

  return (
    <FormComponentEditorContainer>
      <EditorInput settings={settings} name="label" label="Label" handleOnChange={handleOnChange} />
      <EditorInput settings={settings} name="name" label="Field name" handleOnChange={handleOnChange} />
      <EditorOptions
        options={options}
        settings={settings}
        name="options"
        label="Items"
        handleOnChange={handleOnChange}
        handleOnChangeOptions={onChangeOptions ?? (() => {})}
      />
    </FormComponentEditorContainer>
  )
}

export const formComponents: FormComponentRegistration[] = [
  {
    key: 'Header', icon: FaHeading,
    settings: { label: 'Header', name: 'Header' },
    component: MantineHeader,
    editor: { label: 'EditorInput' },
  },
  {
    key: 'Paragraph', icon: FaParagraph,
    settings: { label: 'Paragraph', content: 'Example text', name: 'Paragraph' },
    component: MantineParagraph,
    editor: { content: 'EditorTextArea' },
  },
  {
    key: 'TextInput', icon: FaFont,
    settings: { label: 'Text input', name: 'TextInput' },
    component: MantineTextInput,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'TextArea', icon: FaAlignLeft,
    settings: { label: 'Text area', name: 'TextArea' },
    component: MantineTextArea,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'NumberInput', icon: FaHashtag,
    settings: { label: 'Number', name: 'NumberInput' },
    component: MantineNumber,
    editor: { label: 'EditorInput', placeholder: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'SelectInput', icon: FaList,
    options: [],
    settings: { label: 'Select', name: 'Select' },
    component: MantineSelect,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox', options: 'EditorOptions' },
  },
  {
    key: 'RadioGroup', icon: FaDotCircle,
    options: [],
    settings: { label: 'Radio group', name: 'RadioGroup' },
    component: MantineRadio,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox', options: 'EditorOptions' },
  },
  {
    key: 'Checkbox', icon: FaCheckSquare,
    settings: { label: 'Checkbox', name: 'Checkbox' },
    component: MantineCheckbox,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'DatePicker', icon: FaCalendar,
    settings: { label: 'Date', name: 'DatePicker' },
    component: MantineDate,
    editor: { label: 'EditorInput', name: 'EditorInput', required: 'EditorCheckbox' },
  },
  {
    key: 'Switch', icon: FaToggleOn,
    settings: { label: 'Toggle', name: 'Switch' },
    component: MantineSwitch,
    editor: { label: 'EditorInput', name: 'EditorInput' },
  },
  {
    key: 'ListSwitcher', icon: FaExchangeAlt,
    options: [
      { id: '1', title: 'Dashboard', value: 'dashboard' },
      { id: '2', title: 'Settings', value: 'settings' },
      { id: '3', title: 'Notifications', value: 'notifications' },
      { id: '4', title: 'Integrations', value: 'integrations' },
    ],
    settings: { label: 'List switcher', name: 'ListSwitcher' },
    component: ListSwitcher,
    editor: ListSwitcherEditor,
  },
]

export const formWrapper: FormConfig = {
  component: FormWrapper,
}
