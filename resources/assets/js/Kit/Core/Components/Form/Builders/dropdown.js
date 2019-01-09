import React, { Component } from 'react'
import _ from 'lodash'
import { Dropdown as SuiDropdown } from 'semantic-ui-react'
import { input } from './input'
import { fieldState } from './fieldState'

const render = props => {
  const { fieldInfo, value, error, onChange, onBlur } = props
  const { inputLabel, options } = fieldInfo
  const dropdownArgs = fieldState(props)
  return (
    <SuiDropdown
      error={error}
      fluid
      selection
      options={options(dropdownArgs)}
      defaultValue={value}
      onChange={(e, d) => onChange({ ...dropdownArgs, value: d.value }, onBlur)}
      style={{ width: '100%' }}
      label={inputLabel(dropdownArgs) || null}
    />
  )
}

function dropdown(config = {}) {
  return input({
    type: 'Dropdown',
    options: [],
    render,
    ...config,
  })
}

export { dropdown }
