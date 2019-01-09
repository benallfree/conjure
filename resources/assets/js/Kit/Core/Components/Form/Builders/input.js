import React from 'react'
import { Label } from 'semantic-ui-react'
import { field } from './field'
import { fieldState } from './fieldState'

function input(config = {}) {
  const finalConfig = {
    type: 'Input',
    required: false,
    defaultValue: null,
    validate: true,
    inputLabel: '',
    memo: '',
    help: '',

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

  fieldInfo.render = (render => args => {
    const { errorMessage, showHelp } = args
    const { help, memo } = fieldInfo
    const inputArgs = fieldState({ fieldInfo, ...args })
    const memoStr = memo(inputArgs)
    const helpStr = help(inputArgs)
    return (
      <React.Fragment>
        {render({ ...args, error: !!errorMessage })}
        {helpStr && <Label pointing>{helpStr}</Label>}
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {memoStr && (
          <div style={{ margin: 5, marginBottom: 10 }}>{memoStr}</div>
        )}
      </React.Fragment>
    )
  })(fieldInfo.render)

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
    const inputArgs = fieldState(args)
    const isRequired = required(inputArgs)
    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim().length === 0)
    if (isRequired && isEmpty) {
      return `Required`
    }
    return handler({ fieldInfo, ...inputArgs })
  })(fieldInfo.validate)

  return fieldInfo
}

export { input }
