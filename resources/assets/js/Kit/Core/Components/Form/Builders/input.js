import { field } from './field'

function input(config = {}) {
  const finalConfig = {
    type: 'Input',
    required: false,
    defaultValue: null,
    validate: true,
    inputLabel: '',
    ...config,
  }

  if (finalConfig.validate instanceof RegExp) {
    finalConfig.validate = (re => ({ value }) => {
      if (!value) return true
      if (value.match(re) === null) return 'Invalid format.'
      return true
    })(finalConfig.validate)
  }

  const fieldInfo = field(finalConfig)

  fieldInfo.defaultValue = (handler => args => {
    const value = handler(args)
    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim().length === 0)
    if (isEmpty) return ''
    return value
  })(fieldInfo.defaultValue)

  fieldInfo.validate = (handler => args => {
    const { value } = args
    const { required } = fieldInfo
    const isRequired = required(args)
    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim().length === 0)
    if (isRequired && isEmpty) {
      return `Required`
    }
    return handler({ fieldInfo, ...args })
  })(fieldInfo.validate)

  return fieldInfo
}

export { input }
