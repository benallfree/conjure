import numeral from 'numeral'
import { maskedText, createMaskArrayFromString } from './maskedText'

function range(config = {}) {
  const field = maskedText({
    type: 'Range',
    mask: args => {
      const {
        fieldInfo: { max },
      } = args
      return createMaskArrayFromString('0'.repeat(`${max(args)}`.length))
    },
    unmask: /[^\d]/g,
    min: 0,
    max: 100,
    defaultValue: 0,
    validate: args => {
      const {
        value: v,
        fieldInfo: { min, max, conformValue },
      } = args
      const minValue = min(args)
      const maxValue = max(args)
      if (v < minValue || v > maxValue)
        return `Value must be between ${conformValue({
          ...args,
          value: minValue,
        })} and ${conformValue({ ...args, value: maxValue })}.`
      return true
    },
    placeholderChar: '0',
    ...config,
  })

  return field
}

export { range }
