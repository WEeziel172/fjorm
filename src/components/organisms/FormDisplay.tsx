import { useEffect, useMemo, useRef, useState } from 'react'
import { deserializeFormItems } from '../../utils/useFormItems'
import type { Config } from '../../utils/config'
import type { FormItem, SerializedFormItem, FormConfig } from '../../types'

function FormDisplayBody({
  data,
  config,
  form,
  onSubmit,
}: {
  data: SerializedFormItem[]
  config: Config
  form?: FormConfig
  onSubmit?: (data: Record<string, unknown>) => void
}) {
  const formItems = useMemo(() => deserializeFormItems(data, config), [data, config])

  const [values, setValues] = useState<Record<string, unknown>>({})
  const valuesRef = useRef(values)

  // Reset valuesRef when form data changes to prevent stale values from being submitted
  // This works alongside the key-based remount in FormDisplay component
  useEffect(() => {
    valuesRef.current = {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues({})
  }, [data, config])

  // Pre-compute stable onChange callbacks per field name
  const nonValueNames = useMemo(
    () => new Set(formItems.filter(item => item.providesValue === false).map(item => item.settings.name)),
    [formItems],
  )

  const onChangeCallbacks = useMemo(() => {
    const callbacks: Record<string, (value: unknown) => void> = {}
    for (const item of formItems) {
      if (item.providesValue === false) continue
      const name = item.settings.name
      if (!callbacks[name]) {
        callbacks[name] = (value: unknown) => {
          const next = { ...valuesRef.current, [name]: value }
          valuesRef.current = next
          setValues({ ...next })
        }
      } else {
        console.warn(
          `Duplicate field name detected: "${name}". ` +
          'Only the first field with this name will produce values. ' +
          'Ensure all field names are unique.',
        )
      }
    }
    return callbacks
  }, [formItems])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formEl = e.target as HTMLFormElement
    const formData = new FormData(formEl)
    const dataObj: Record<string, unknown> = {}

    for (const item of data) {
      const name = item.settings.name
      if (nonValueNames.has(name)) continue
      const tracked = valuesRef.current[name]
      dataObj[name] = (name in valuesRef.current && tracked !== null)
        ? tracked
        : formData.has(name)
          ? formData.get(name)
          : false
    }

    onSubmit?.(dataObj)
  }

  const renderComponent = ({ component: Component, settings, id, options, value }: FormItem) => (
    <Component
      options={options}
      label={settings.label}
      key={id}
      settings={settings}
      id={id}
      value={value}
      onChangeValue={onChangeCallbacks[settings.name]}
    />
  )

  if (form && form.component) {
    const { component: Form, actions } = form

    return (
      <div className="form-display-container">
        <Form onSubmit={onSubmit} fjormValues={values}>
          {formItems.length > 0 && formItems.map(renderComponent)}
          {actions}
        </Form>
      </div>
    )
  }

  return (
    <form id="form" onSubmit={handleSubmit} className="form-display-container">
      {formItems.length > 0 && formItems.map(renderComponent)}
      <button type="submit" className="form-display-submit">Save</button>
    </form>
  )
}

export function FormDisplay(props: {
  data: SerializedFormItem[]
  config: Config
  form?: FormConfig
  onSubmit?: (data: Record<string, unknown>) => void
}) {
  const dataKey = useMemo(
    () => JSON.stringify(props.data),
    [props.data],
  )

  return <FormDisplayBody key={dataKey} {...props} />
}
