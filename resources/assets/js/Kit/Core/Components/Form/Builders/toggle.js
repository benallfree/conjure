import React, { Component } from 'react'
import _ from 'lodash'
import { Checkbox } from 'semantic-ui-react'
import { input } from './input'
import { fieldState } from './fieldState'

function toggle(config = {}) {
  return input({
    type: 'Toggle',
    defaultValue: false,
    render: props => {
      const { value, onChange, onBlur } = props
      const toggleArgs = fieldState(props)
      return (
        <Checkbox
          toggle
          defaultChecked={value}
          onChange={(e, d) =>
            onChange({ ...toggleArgs, value: d.checked }, onBlur)
          }
        />
      )
    },
    ...config,
  })
}

export { toggle }
