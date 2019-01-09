import numeral from 'numeral'
import { range } from './range'

function integer(config = {}) {
  const field = range({
    type: 'Integer',
    inputLabel: 'qty',
    ...config,
  })

  field.conformValue = (parentCv => args => {
    const {
      value,
      fieldInfo: { max },
    } = args
    const newValue = numeral(value).format('0'.repeat(`${max()}`.length))
    return parentCv({ ...args, value: newValue })
  })(field.conformValue)

  return field
}

export { integer }
