import numeral from 'numeral'
import { range } from './range'
import { createMaskArrayFromString } from './maskedText'

function float(config = {}) {
  const field = range({
    type: 'Float',
    mask: args => {
      const {
        fieldInfo: { precision, max },
      } = args
      const left = '0'.repeat(`${Math.max(1, Math.trunc(max(args)))}`.length)
      const right = '0'.repeat(precision(args))
      return createMaskArrayFromString(`${left}.${right}`)
    },
    precision: 2,
    unmask: /[^\d.]/g,
    ...config,
  })

  field.unmask = (parent => args => {
    return parseFloat(parent(args))
  })(field.unmask)

  field.conformValue = (parentCv => args => {
    const {
      value,
      fieldInfo: { max, precision },
    } = args
    const left = '0'.repeat(`${Math.max(1, Math.trunc(max(args)))}`.length)
    const right = '0'.repeat(precision(args))

    const newValue = numeral(value).format(`${left}.${right}`)
    return parentCv({ ...args, value: newValue })
  })(field.conformValue)

  return field
}

export { float }
