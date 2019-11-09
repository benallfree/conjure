import React from 'react'
import _ from 'lodash'
import changeCase, { paramCase } from 'change-case'

function createHandler({ handler, fieldInfo }) {
  const handlerFunc = typeof handler === 'function' ? handler : () => handler

  return args => handlerFunc({ fieldInfo, ...args })
}

function buildProps(props) {
  const fieldInfo = {}
  _.each(props, (handler, k) => {
    fieldInfo[k] = createHandler({
      handler,
      fieldInfo,
    })
  })

  return fieldInfo
}

function field(props) {
  return buildProps({
    type: 'Field',
    label: ({ name }) => changeCase.title(name),
    displayIf: true,
    help: null,
    render: ({ name }) => <div>{changeCase.title(name)} placeholder</div>,
    ...props,
  })
}

export { field }
