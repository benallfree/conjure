import React, { Component } from 'react'
import _ from 'lodash'
import { Checkbox } from 'semantic-ui-react'
import { field } from './field'

function toggle(config = {}) {
  return field({
    defaultValue: false,
    render: props => {
      const { value, onChange, onBlur } = props
      return (
        <Checkbox
          toggle
          defaultChecked={value}
          onChange={(e, d) => onChange(d.checked, onBlur)}
        />
      )
    },
    type: 'Toggle',
    ...config,
  })
}

export { toggle }
