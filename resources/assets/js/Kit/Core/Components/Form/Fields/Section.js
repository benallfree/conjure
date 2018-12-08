import React from 'react'
import { Header } from 'semantic-ui-react'

const Section = props => {
  const {
    fieldInfo: { label },
  } = props
  return <Header h={3}>{label(props)}</Header>
}

export { Section }
