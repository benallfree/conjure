import numeral from 'numeral'
import { range } from './range'

function integer(config = {}) {
  const max = config.max || 0.0
  const digits = `${max}`.length
  const mask = '0'.repeat(digits)
  return range({
    inputLabel: 'qty',
    format: ({ value }) => numeral(parseInt(value, 0)).format(mask),
    mask,
    unmask: /[^\d]/g,
    ...config,
  })
}

export { integer }
