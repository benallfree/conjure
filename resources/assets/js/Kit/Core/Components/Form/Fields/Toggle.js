import React, { Component } from 'react'
import _ from 'lodash'
import { Checkbox } from 'semantic-ui-react'

const Toggle = props => {
  const { value, onChange } = props
  return <Checkbox toggle defaultChecked={value} onChange={onChange} />
}

export { Toggle }
