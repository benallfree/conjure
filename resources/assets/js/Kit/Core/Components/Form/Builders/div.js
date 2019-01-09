import React from 'react'
import changeCase, { paramCase } from 'change-case'
import { field } from './field'
import { fieldState } from './fieldState'

function div(config = {}) {
  return field({
    type: 'Div',
    content: ({ name }) => <div>{changeCase.title(name)} content</div>,
    render: props => {
      const {
        fieldInfo: { content },
      } = props
      const divArgs = fieldState(props)
      return content(divArgs)
    },
    ...config,
  })
}

export { div }
