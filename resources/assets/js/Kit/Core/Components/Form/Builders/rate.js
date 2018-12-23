import { currency } from './currency'

function rate(config = {}) {
  return currency({
    min: 0.0,
    max: 0.05,
    precision: 4,
    type: 'Rate',
    ...config,
  })
}

export { rate }
