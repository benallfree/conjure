import React, { Component } from 'react'
import _ from 'lodash'
import { Checkbox, List } from 'semantic-ui-react'
import { field } from './field'

function checklist(config = {}) {
  return field({
    defaultValue: info => {
      const { options } = info
      const ret = {}
      _.each(options(info), (v, k) => {
        ret[v.key] = false
      })
      return ret
    },
    render: props => {
      const {
        fieldInfo: { options },
        error,
        value,
      } = props

      const doChange = newValue => {
        const { onBlur, onChange } = props
        onChange(newValue, onBlur)
      }

      const handleChange = key => (e, d) => {
        doChange({ ...value, [key]: d.checked })
      }

      const toggleCheck = key => e => {
        doChange({ ...value, [key]: !value[key] })
      }

      return (
        <List>
          {_.map(options(props), opt => (
            <List.Item key={opt.key}>
              <Checkbox
                className={error ? 'error' : ''}
                checked={value[opt.key]}
                onChange={handleChange(opt.key)}
              />
              <div
                style={{ display: 'inline-block', cursor: 'pointer' }}
                onClick={toggleCheck(opt.key)}
              >
                {opt.text}
              </div>
            </List.Item>
          ))}
        </List>
      )
    },
    type: 'Checklist',
    ...config,
  })
}

export { checklist }
