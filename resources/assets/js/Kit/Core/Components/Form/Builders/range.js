import numeral from 'numeral'
import { maskedText, createMaskArrayFromString } from './maskedText'

function range(config = {}) {
  const field = maskedText({
    type: 'Range',
    mask: ({ fieldInfo: { max } }) =>
      createMaskArrayFromString('0'.repeat(`${max()}`.length)),
    unmask: /[^\d]/g,
    min: 0,
    max: 100,
    defaultValue: 0,
    validate: args => {
      const {
        value: v,
        fieldInfo: { min, max, conformValue },
      } = args
      if (v < min() || v > max())
        return `Value must be between ${conformValue({
          ...args,
          value: min(),
        })} and ${conformValue({ ...args, value: max() })}.`
      return true
    },
    placeholderChar: '0',
    ...config,
  })

  return field
}

export { range }
