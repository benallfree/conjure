import React, { Component } from 'react'
import _ from 'lodash'
import { Input } from 'semantic-ui-react'
import changeCase from 'change-case'
import { input } from './input'
import { fieldState } from './fieldState'

function text(config = {}) {
  const finalConfig = {
    type: 'Text',
    placeholder: ({ name }) => changeCase.title(name),
    filter: ({ value }) => value,
    icon: false,
    params: () => ({}),
    render: props => {
      const {
        fieldInfo: { placeholder, inputLabel, icon, params, filter },
        error,
        onBlur,
        onChange,
        value,
      } = props
      const textArgs = fieldState(props)
      return (
        <Input
          error={error}
          label={inputLabel(textArgs) || null}
          style={{ width: '100%' }}
          onBlur={() => onBlur(textArgs)}
          icon={icon(textArgs)}
          iconPosition="left"
          placeholder={placeholder(textArgs)}
          onChange={e => {
            const { selectionStart } = e.target
            e.persist()
            onChange(
              {
                ...textArgs,
                value: filter({ ...textArgs, value: e.target.value }),
              },
              () => {
                e.target.selectionStart = selectionStart
                e.target.selectionEnd = e.target.selectionStart
              },
            )
          }}
          value={value}
          {...params(textArgs)}
        />
      )
    },
    ...config,
  }

  const fieldInfo = input(finalConfig)
  fieldInfo.defaultValue = (handler => args => {
    const { format } = fieldInfo
    const value = handler(args)
    if (value.length === 0) return value
    return value
  })(fieldInfo.defaultValue)

  return fieldInfo
}

export { text }
