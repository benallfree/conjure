import React from 'react'
import _ from 'lodash'
import changeCase, { paramCase } from 'change-case'

function createMask(s) {
  const arr = _.map(s, c => {
    if (c.match(/\d/) !== null) {
      return /\d/
    }
    return c
  })
  return arr
}

const DEFAULTS = {
  required: false,
  type: 'Text',
  placeholder: ({ name }) => changeCase.title(name),
  label: ({ name }) => changeCase.title(name),
  options: [],
  content: ({ name }) => <div>{changeCase.title(name)} content</div>,
  displayIf: true,
  defaultValue: null,
  inputLabel: '',
  help: null,
  validate: true,
  mask: false,
  unmask: ({ value }) => value,
  inputFormat: ({ value }) => value,
  format: ({ value }) => value,
  input: ({ value }) => value,
  calculate: () => {},
  icon: false,
  params: () => ({}),
  render: ({ name }) => <div>{changeCase.title(name)} placeholder</div>,
}

function createHandler({ handlerName, fieldHandler, defaultHandler }) {
  function create() {
    let val = fieldHandler
    if (val === undefined) val = defaultHandler
    if (typeof val === 'function') return val
    switch (handlerName) {
      case 'mask':
        if (typeof val === 'string') {
          val = createMask(val)
          return () => val
        }
        break
      case 'unmask':
        if (val instanceof RegExp) {
          return ({ value }) => value.replace(val, '')
        }
        break
      case 'validate':
        if (val instanceof RegExp) {
          return ({ value }) => {
            if (!value) return true
            if (value.match(val) === null) return 'Invalid format.'
            return true
          }
        }
        break
      default:
        break
    }
    return () => val
  }

  const handler = create()
  switch (handlerName) {
    case 'validate':
      return args => {
        const { fieldInfo, value } = args
        const { required } = fieldInfo
        const isRequired = required(args)
        const isEmpty =
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim().length === 0)
        if (isRequired && isEmpty) {
          return `Required`
        }
        return handler(args)
      }
    case 'defaultValue':
      return args => {
        const { fieldInfo } = args
        const { format, defaultValue } = fieldInfo
        let value = handler(args)
        const isEmpty =
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim().length === 0)
        if (!isEmpty) {
          value = format({ ...args, value })
        }
        return value
      }
    default:
  }
  return handler
}

function buildProps(props) {
  const ret = {}
  _.each(DEFAULTS, (v, k) => {
    ret[k] = createHandler({
      handlerName: k,
      fieldHandler: props[k],
      defaultHandler: v,
    })
  })

  return ret
}

function field(props = {}) {
  return buildProps(props)
}

export { field }
