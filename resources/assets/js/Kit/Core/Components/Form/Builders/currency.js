import { float } from './float'

function currency(config = {}) {
  return float({
    min: 0,
    max: 1000,
    precision: 2,
    inputLabel: () => '$',
    ...config,
  })
}

export { currency }
