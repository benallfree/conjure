import React from 'react'
import _ from 'lodash'
import { Input } from 'semantic-ui-react'
import MaskedInput from 'react-text-mask'
import changeCase, { paramCase } from 'change-case'
import { input } from './input'

function createMask(s) {
  const arr = _.map(s, c => {
    if (c.match(/\d/) !== null) {
      return /\d/
    }
    return c
  })
  return arr
}

const render = props => {
  const {
    fieldInfo: { placeholder, inputLabel, mask, icon, params, unmask, format },
    value,
    error,
    onBlur,
    onChange,
  } = props
  return (
    <Input
      error={error}
      label={inputLabel(props) || null}
      style={{ width: '100%' }}
      onBlur={() => onBlur({ ...props, value: format(props) })}
      icon={icon(props)}
      iconPosition="left"
      input={
        <MaskedInput
          mask={mask(props)}
          value={value}
          placeholder={placeholder(props)}
          showMask={mask(props) !== false}
          onChange={e => onChange(unmask({ ...props, value: e.target.value }))}
        />
      }
      {...params(props)}
    />
  )
}

const placeholder = ({ name }) => changeCase.title(name)

function text(config = {}) {
  const finalConfig = {
    type: 'Text',
    placeholder,
    mask: false,
    unmask: ({ value }) => value,
    inputFormat: ({ value }) => value,
    format: ({ value }) => value,
    input: ({ value }) => value,
    icon: false,
    params: () => ({}),
    render,
    ...config,
  }

  if (typeof finalConfig.mask === 'string') {
    finalConfig.mask = createMask(finalConfig.mask)
  }

  if (typeof finalConfig.unmask instanceof RegExp) {
    finalConfig.unmask = (re => ({ value }) => value.replace(re, ''))(
      finalConfig.unmask,
    )
  }

  const fieldInfo = input(finalConfig)

  fieldInfo.defaultValue = (handler => args => {
    const { format } = fieldInfo
    const value = handler(args)
    if (value.length === 0) return value
    return format({ ...args, value })
  })(fieldInfo.defaultValue)

  return fieldInfo
}

export { text }
