import numeral from 'numeral'
import { text } from './text'

function range(config = {}) {
  const min = config.min || 0.0
  const max = config.max || 0.0
  return text({
    defaultValue: min,
    validate: ({ value }) => {
      const v = parseFloat(value)
      if (v < min || v > max) return `Value must be between ${min} and ${max}.`
      return true
    },
    type: 'Range',
    ...config,
  })
}

export { range }
