import numeral from 'numeral'

function integer(config = {}) {
  const min = config.min || 0
  const max = config.max || 0
  const digits = `${max}`.length
  const mask = '0'.repeat(digits)
  return {
    defaultValue: ({ context }) => config.min || 0,
    inputLabel: () => 'qty',
    format: ({ value }) => numeral(parseInt(value, 0)).format(mask),
    mask,
    unmask: /[^\d]/g,
    validate: ({ value }) =>
      parseInt(value, 0) >= min && parseInt(value, 0) <= max,
    ...config,
  }
}

export { integer }
