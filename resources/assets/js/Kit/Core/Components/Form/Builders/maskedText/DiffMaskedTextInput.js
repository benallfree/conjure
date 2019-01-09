import React, { Component } from 'react'
import _ from 'lodash'
import { Input } from 'semantic-ui-react'
import { diffChars } from 'diff'
import { fieldState } from '../fieldState'

function j(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

class DiffMaskedTextInput extends Component {
  handleChange = e => {
    const {
      fieldInfo: { unmask, mask, conformValue },
      onChange,
    } = this.props
    const { selectionStart, selectionEnd, value } = e.target
    const textArgs = fieldState(this.props)
    const originalConformedValue = conformValue(textArgs)
    const originalConformedValueIdx = 0
    j({ selectionStart, selectionEnd, value, originalConformedValue })

    const diffQ = diffChars(originalConformedValue, value)
    const maskQ = [...mask()]
    const originalMaskArr = [...mask()]
    let originalMaskIdx = 0
    let newConformedValue = ''
    let newPos = 0
    let stopAdvancingCursor = false

    while (diffQ.length > 0 && maskQ.length > 0) {
      j('---outer---')
      j({ diffQ })
      const change = diffQ.shift()
      const isOriginal = !change.added && !change.removed
      const changeQ = change.value.split('')
      j({ change, isOriginal, changeQ })
      while (changeQ.length > 0 && maskQ.length > 0) {
        j('----inner----')
        const m = maskQ.shift()
        const isEditable = m instanceof RegExp
        j({ maskQ, m, isEditable })
        if (isEditable) {
          const ch = changeQ.shift()
          j({ change, changeQ, ch })

          if (isOriginal) {
            const originalMaskItem = originalMaskArr[originalMaskIdx]
            const isOriginalMaskItemEditable =
              originalMaskItem instanceof RegExp
            j({
              originalMaskArr,
              originalMaskItem,
              isOriginalMaskItemEditable,
              originalMaskIdx,
            })

            if (isOriginalMaskItemEditable) {
              newConformedValue += ch
            } else {
              maskQ.unshift(m)
              if (!stopAdvancingCursor) newPos = Math.max(0, newPos - 1)
            }
            originalMaskIdx += 1
            j({ originalMaskIdx })
          }
          if (change.added) {
            const isCharAllowed = ch.match(m) !== null
            j({ isCharAllowed })
            if (isCharAllowed) {
              newConformedValue += ch
            } else {
              maskQ.unshift(m)
              if (!stopAdvancingCursor) newPos = Math.max(0, newPos - 1)
            }
            stopAdvancingCursor = changeQ.length === 0
            if (stopAdvancingCursor) newPos += 1

            j({ newConformedValue, newPos })
          }
          if (change.removed) {
            originalMaskIdx += 1
            stopAdvancingCursor = changeQ.length === 0
            newPos = Math.max(0, newPos - 1)
            // if (stopAdvancingCursor) newPos += 1
            maskQ.unshift(m)
          }
        } else {
          newConformedValue += m
        }
        if (!stopAdvancingCursor) newPos += 1

        j({ newConformedValue, newPos })
      }
    }

    const unmaskedValue = unmask({ ...textArgs, value: newConformedValue })

    e.preventDefault()
    e.persist()
    onChange(
      {
        ...textArgs,
        value: unmaskedValue,
      },
      () => {
        e.target.selectionStart = this.findNextEditablePos(newPos) || newPos
        e.target.selectionEnd = e.target.selectionStart
      },
    )
  }

  handleKeyPress = e => {
    const {
      onChange,
      fieldInfo: { mask, unmask, conformValue },
      value: rawValue,
    } = this.props
    const { selectionStart, selectionEnd } = e.target
    const textArgs = fieldState(this.props)
    const { key } = e
    const conformedValue = conformValue(textArgs)
    if (selectionStart !== selectionEnd) return

    const maskArr = mask()
    const i = this.findNextEditablePos(selectionStart)
    if (i === null) return
    if (key === conformedValue.slice(i, i + 1)) {
      console.log({ selectionStart, i }, maskArr[i + 1])
      e.target.selectionStart = this.findNextEditablePos(i + 1) || i + 1
      e.target.selectionEnd = e.target.selectionStart
      e.preventDefault()
    }
  }

  findNextEditablePos(startPos) {
    const {
      fieldInfo: { mask },
    } = this.props
    const maskArr = mask()
    for (let i = startPos; i < maskArr.length; i += 1) {
      if (maskArr[i] instanceof RegExp) return i
    }
    return null
  }

  render() {
    const {
      fieldInfo: { placeholder, inputLabel, icon, params, conformValue },
      error,
      onBlur,
    } = this.props
    const textArgs = fieldState(this.props)

    const conformedValue = conformValue(textArgs)
    return (
      <Input
        onKeyPress={this.handleKeyPress}
        error={error}
        label={inputLabel(textArgs) || null}
        style={{ width: '100%' }}
        onBlur={() => onBlur(textArgs)}
        onChange={this.handleChange}
        icon={icon(textArgs)}
        iconPosition="left"
        placeholder={placeholder(textArgs)}
        value={conformedValue}
        {...params(textArgs)}
      />
    )
  }
}

export { DiffMaskedTextInput }
