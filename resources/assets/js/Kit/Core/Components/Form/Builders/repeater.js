import React, { Component } from 'react'
import _ from 'lodash'
import { List } from 'semantic-ui-react'
import { input } from './input'
import { fieldState } from './fieldState'
import { Form } from '../Form'

function repeater(config = {}) {
  return input({
    type: 'Repeater',
    items: [],
    itemRender: () => null,
    defaultValue: info => {
      const {
        fieldInfo: { items },
      } = info
      const ret = {}
      _.each(items(info), (v, k) => {
        ret[v.id] = 0
      })
      return ret
    },
    render: props => {
      const {
        fieldInfo: { items, itemFactory },
        onChange,
        onBlur,
      } = props
      const repeaterArgs = fieldState(props)
      const fields = _.reduce(
        items(repeaterArgs),
        (r, item) => {
          r[item.id] = itemFactory(item)
          return r
        },
        {},
      )
      const handleChange = (name, value, form) => {
        onChange({ ...repeaterArgs, value: { ...form, [name]: value } })
      }
      const handleBlur = (name, value, form) => {
        onBlur({ ...repeaterArgs, value: { ...form, [name]: value } })
      }
      return (
        <Form
          fields={fields}
          fieldsTemplate={Form.FieldsTemplates.INPUTS_ONLY}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      )
    },
    ...config,
  })
}

export { repeater }
