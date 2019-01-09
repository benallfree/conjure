import numeral from 'numeral'
import { range } from './range'
import { createMaskArrayFromString } from './maskedText'

function float(config = {}) {
  const field = range({
    type: 'Float',
    mask: ({ fieldInfo: { precision, max } }) => {
      const left = '0'.repeat(`${Math.max(1, Math.trunc(max()))}`.length)
      const right = '0'.repeat(precision())
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
    const left = '0'.repeat(`${Math.max(1, Math.trunc(max()))}`.length)
    const right = '0'.repeat(precision())

    const newValue = numeral(value).format(`${left}.${right}`)
    return parentCv({ ...args, value: newValue })
  })(field.conformValue)

  return field
}

export { float }
