import { useState } from 'react'
import { Form, Input, Select, Typography, Checkbox, InputNumber, DatePicker, Radio, Switch } from 'antd'
import {
  FaHeading, FaParagraph, FaFont, FaList, FaCheckSquare,
  FaHashtag, FaCalendar, FaDotCircle, FaToggleOn, FaAlignLeft,
} from 'react-icons/fa'
import type { FormComponentRegistration, FormComponentProps, FormConfig, FormConfigProps } from 'fjorm'

const { Title, Paragraph: AntPTypography } = Typography
const { TextArea } = Input

export function FormWrapper({ children, onSubmit, ...rest }: FormConfigProps) {
  const handleFinish = (values: Record<string, unknown>) => {
    onSubmit?.(values)
  }

  return (
    <Form layout="vertical" style={{ maxWidth: 640, padding: 24 }} onFinish={handleFinish} {...rest}>
      {children}
      <Form.Item>
        <button type="submit" style={{
          padding: '8px 24px', border: 'none', borderRadius: 6,
          background: '#1677ff', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>
          Submit
        </button>
      </Form.Item>
    </Form>
  )
}

// --- Display Components ---

function AntHeader({ settings }: FormComponentProps) {
  return <Title level={2} style={{ marginTop: 8 }}>{settings.label}</Title>
}

function AntParagraph({ settings }: FormComponentProps) {
  return <AntPTypography style={{ whiteSpace: 'pre-line' }}>{(settings.content as string) ?? ''}</AntPTypography>
}

function AntTextInput({ settings, label }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name}
      rules={settings.required ? [{ required: true, message: `${label} is required` }] : undefined}>
      <Input placeholder={(settings.placeholder as string) ?? ''} />
    </Form.Item>
  )
}

function AntTextArea({ settings, label }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name}
      rules={settings.required ? [{ required: true, message: `${label} is required` }] : undefined}>
      <TextArea rows={4} placeholder={(settings.placeholder as string) ?? ''} />
    </Form.Item>
  )
}

function AntSelect({ settings, label, options }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name}
      rules={settings.required ? [{ required: true, message: `${label} is required` }] : undefined}>
      <Select placeholder="Select...">
        {options?.map((opt) => (
          <Select.Option key={opt.id} value={opt.value}>{opt.title}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}

function AntCheckbox({ settings, label }: FormComponentProps) {
  return (
    <Form.Item name={settings.name} valuePropName="checked"
      rules={settings.required ? [{ required: true, message: `${label} is required` }] : undefined}>
      <Checkbox>{label}</Checkbox>
    </Form.Item>
  )
}

function AntNumber({ settings, label }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name}
      rules={settings.required ? [{ required: true, message: `${label} is required` }] : undefined}>
      <InputNumber style={{ width: '100%' }} placeholder={(settings.placeholder as string) ?? ''} />
    </Form.Item>
  )
}

function AntDate({ settings, label }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name}
      rules={settings.required ? [{ required: true, message: `${label} is required` }] : undefined}>
      <DatePicker style={{ width: '100%' }} />
    </Form.Item>
  )
}

function AntRadio({ settings, label, options }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name}
      rules={settings.required ? [{ required: true, message: `${label} is required` }] : undefined}>
      <Radio.Group>
        {options?.map((opt) => (
          <Radio key={opt.id} value={opt.value}>{opt.title}</Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  )
}

function AntSwitch({ settings, label }: FormComponentProps) {
  return (
    <Form.Item label={label} name={settings.name} valuePropName="checked">
      <Switch />
    </Form.Item>
  )
}

// --- Component Registry ---

export const formComponents: FormComponentRegistration[] = [
  {
    key: 'Header',
    settings: { label: 'Header', name: 'Header' },
    icon: FaHeading,
    component: AntHeader,
    editor: { label: 'EditorInput' },
    providesValue: false,
  },
  {
    key: 'Paragraph',
    settings: { label: 'Paragraph', content: 'Example text', name: 'Paragraph' },
    icon: FaParagraph,
    component: AntParagraph,
    editor: { content: 'EditorTextArea' },
    providesValue: false,
  },
  {
    key: 'TextInput',
    icon: FaFont,
    settings: { label: 'Text input', name: 'TextInput' },
    component: AntTextInput,
    editor: {
      label: 'EditorInput',
      placeholder: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
    },
  },
  {
    key: 'TextArea',
    icon: FaAlignLeft,
    settings: { label: 'Text area', name: 'TextArea' },
    component: AntTextArea,
    editor: {
      label: 'EditorInput',
      placeholder: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
    },
  },
  {
    key: 'NumberInput',
    icon: FaHashtag,
    settings: { label: 'Number', name: 'NumberInput' },
    component: AntNumber,
    editor: {
      label: 'EditorInput',
      placeholder: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
    },
  },
  {
    key: 'SelectInput',
    icon: FaList,
    options: [],
    settings: { label: 'Select', name: 'Select' },
    component: AntSelect,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
      options: 'EditorOptions',
    },
  },
  {
    key: 'RadioGroup',
    icon: FaDotCircle,
    options: [],
    settings: { label: 'Radio group', name: 'RadioGroup' },
    component: AntRadio,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
      options: 'EditorOptions',
    },
  },
  {
    key: 'Checkbox',
    icon: FaCheckSquare,
    settings: { label: 'Checkbox', name: 'Checkbox' },
    component: AntCheckbox,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
    },
  },
  {
    key: 'DatePicker',
    icon: FaCalendar,
    settings: { label: 'Date', name: 'DatePicker' },
    component: AntDate,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
      required: 'EditorCheckbox',
    },
  },
  {
    key: 'Switch',
    icon: FaToggleOn,
    settings: { label: 'Toggle', name: 'Switch' },
    component: AntSwitch,
    editor: {
      label: 'EditorInput',
      name: 'EditorInput',
    },
  },
]

