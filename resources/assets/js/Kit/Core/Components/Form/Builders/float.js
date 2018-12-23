import numeral from 'numeral'
import { range } from './range'

function float(config = {}) {
  const max = config.max || 0.0
  const precision = config.precision || 2
  const left = '0'.repeat(`${Math.max(1, max)}`.length)
  const right = '0'.repeat(precision)
  const mask = `${left}.${right}`
  return range({
    format: ({ value }) => numeral(parseFloat(value)).format(mask),
    mask,
    unmask: ({ value }) => value.replace(/[^\d.]/g, '').replace(/\.$/, ''),
    type: 'Float',
    ...config,
  })
}

export { float }
