import React, { Component } from 'react'
import _ from 'lodash'
import { Dropdown as SuiDropdown } from 'semantic-ui-react'

const Dropdown = props => {
  const { fieldInfo, value, error, onChange } = props
  const { inputLabel, options } = fieldInfo
  return (
    <SuiDropdown
      error={error}
      fluid
      selection
      options={options(props)}
      defaultValue={value}
      onChange={onChange}
      style={{ width: '100%' }}
      label={inputLabel(props) || null}
    />
  )
}

export { Dropdown }
