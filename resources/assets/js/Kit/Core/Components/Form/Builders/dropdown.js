import React, { Component } from 'react'
import _ from 'lodash'
import { Dropdown as SuiDropdown } from 'semantic-ui-react'
import { field } from './field'

const Dropdown = props => {
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

export { Dropdown }

function dropdown(config = {}) {
  return field({
    render: props => <Dropdown {...props} />,
    ...config,
    type: 'Dropdown',
  })
}

export { dropdown }
