import React from 'react'
import { Header } from 'semantic-ui-react'
import { field } from './field'
import { fieldState } from './fieldState'

function section(config = {}) {
  return field({
    type: 'Section',
    render: props => {
      const {
        fieldInfo: { label },
      } = props
      const sectionArgs = fieldState(props)
      return <Header h={3}>{label(sectionArgs)}</Header>
    },
    ...config,
  })
}

export { section }
