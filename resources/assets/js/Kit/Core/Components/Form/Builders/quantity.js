import numeral from 'numeral'
import { integer } from './integer'

function quantity(config = {}) {
  const min = config.min || 0
  const max = config.max || 1000
  return integer({
    min,
    max,
    inputLabel: 'qty',
    format: ({ value }) =>
      numeral(parseInt(value, 0)).format('0'.repeat(`${max}`.length)),
    type: 'Quantity',
    ...config,
  })
}

export { quantity }
