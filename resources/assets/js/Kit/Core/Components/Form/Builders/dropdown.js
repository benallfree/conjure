import React, { Component } from 'react'
import _ from 'lodash'
import { Dropdown as SuiDropdown } from 'semantic-ui-react'
import { input } from './input'

const render = props => {
  const { fieldInfo, value, error, onChange, onBlur } = props
  const { inputLabel, options } = fieldInfo
  return (
    <SuiDropdown
      error={error}
      fluid
      selection
      options={options(props)}
      defaultValue={value}
      onChange={(e, d) => onChange(d.value, onBlur)}
      style={{ width: '100%' }}
      label={inputLabel(props) || null}
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
