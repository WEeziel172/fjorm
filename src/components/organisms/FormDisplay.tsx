import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { deserializeFormItems } from '../../utils/useFormItems'
import type { Config } from '../../utils/config'
import type { FormItem, SerializedFormItem, FormConfig } from '../../types'

function flattenTree(items: FormItem[]): FormItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenTree(item.children) : []),
  ])
}

function flattenData(items: SerializedFormItem[]): SerializedFormItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenData(item.children) : []),
  ])
}

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
  const flatItems = useMemo(() => flattenTree(formItems), [formItems])

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
    () =>
      new Set(
        flatItems.filter((item) => item.providesValue === false).map((item) => item.settings.name),
      ),
    [flatItems],
  )

  const onChangeCallbacks = useMemo(() => {
    const callbacks: Record<string, (value: unknown) => void> = {}
    for (const item of flatItems) {
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
  }, [flatItems])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formEl = e.target as HTMLFormElement
    const formData = new FormData(formEl)
    const dataObj: Record<string, unknown> = {}
    const flatData = flattenData(data)

    for (const item of flatData) {
      const name = item.settings.name
      if (nonValueNames.has(name)) continue
      const tracked = valuesRef.current[name]
      dataObj[name] =
        name in valuesRef.current && tracked !== null
          ? tracked
          : formData.has(name)
            ? formData.get(name)
            : false
    }

    onSubmit?.(dataObj)
  }

  function renderTree(items: FormItem[]): ReactNode[] {
    return items.map((item) => {
      const childNodes = item.children ? renderTree(item.children) : undefined
      const { component: Component, settings, id, options, value } = item
      return (
        <Component
          key={id}
          id={id}
          label={settings.label}
          settings={settings}
          options={options}
          value={value}
          onChangeValue={onChangeCallbacks[settings.name]}
        >
          {childNodes}
        </Component>
      )
    })
  }

  if (form && form.component) {
    const { component: Form, actions } = form

    return (
      <div className="form-display-container">
        <Form onSubmit={onSubmit} fjormValues={values}>
          {formItems.length > 0 && renderTree(formItems)}
          {actions}
        </Form>
      </div>
    )
  }

  return (
    <form id="form" onSubmit={handleSubmit} className="form-display-container">
      {formItems.length > 0 && renderTree(formItems)}
      <button type="submit" className="form-display-submit">
        Save
      </button>
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
