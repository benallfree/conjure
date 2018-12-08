import numeral from 'numeral'

function float(config = {}) {
  const min = config.min || 0.0
  const max = config.max || 0.0
  const precision = config.precision || 2
  const left = '0'.repeat(`${Math.max(1, max)}`.length)
  const right = '0'.repeat(precision)
  const mask = `${left}.${right}`
  return {
    defaultValue: ({ context }) => config.min || 0,
    format: ({ value }) => numeral(parseFloat(value)).format(mask),
    mask,
    unmask: ({ value }) => value.replace(/[^\d.]/g, '').replace(/\.$/, ''),
    validate: ({ value }) =>
      parseFloat(value) >= min && parseFloat(value) <= max,
    ...config,
  }
}

export { float }
