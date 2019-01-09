import React, { Component } from 'react'
import _ from 'lodash'
import { text } from '../text'
import { MaskedTextInput } from './MaskedTextInput'
import { createMaskArrayFromString } from './createMaskArrayFromString'

function maskedText(config = {}) {
  const finalConfig = {
    type: 'MaskedText',
    placeholderChar: '_',
    mask: '111',
    unmask: /[^\d]/g,
    conformValue: ({ fieldInfo: { mask, placeholderChar }, value }) => {
      let pos = 0
      const strValue = `${value}`
      const conformedValue = _.map(mask(), m => {
        const c = strValue.slice(pos, pos + 1)

        if (!(m instanceof RegExp)) {
          if (c === m) {
            pos += 1
          }
          return m
        }
        if (pos >= strValue.length) return placeholderChar()
        if (c.match(m) === null) {
          return placeholderChar()
        }
        pos += 1

        return c
      }).join('')
      return conformedValue
    },
    render: props => {
      return <MaskedTextInput {...props} />
    },
    ...config,
  }

  if (typeof finalConfig.mask === 'string') {
    finalConfig.mask = createMaskArrayFromString(finalConfig.mask)
  }

  if (finalConfig.unmask instanceof RegExp) {
    finalConfig.unmask = (re => ({ value }) => value.replace(re, ''))(
      finalConfig.unmask,
    )
  }

  const fieldInfo = text(finalConfig)

  return fieldInfo
}

export { maskedText }
