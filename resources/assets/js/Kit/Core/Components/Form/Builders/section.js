import React from 'react'
import { Header } from 'semantic-ui-react'
import { field } from './field'

function section(config = {}) {
  return field({
    type: 'Section',
    render: props => {
      const {
        fieldInfo: { label },
      } = props
      return <Header h={3}>{label(props)}</Header>
    },
    ...config,
  })
}

export { section }
