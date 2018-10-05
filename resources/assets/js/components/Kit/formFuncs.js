import numeral from 'numeral'
import emailMask from 'text-mask-addons/dist/emailMask'
import _ from 'lodash'

function textField(opts = {}) {
  return { ...opts }
}

function integerField(opts = {}) {
  const min = opts.min || 0
  const max = opts.max || 0
  const digits = `${max}`.length
  const mask = '0'.repeat(digits)
  return {
    defaultValue: ({ context }) => opts.min || 0,
    inputLabel: () => 'qty',
    format: ({ value }) => numeral(parseInt(value, 0)).format(mask),
    mask,
    unmask: /[^\d]/g,
    validate: ({ value }) =>
      parseInt(value, 0) >= min && parseInt(value, 0) <= max,
    ...opts,
  }
}

function quantityField(opts = {}) {
  const min = opts.min || 0
  const max = opts.max || 1000
  return integerField({
    min,
    max,
    inputLabel: () => 'qty',
    format: ({ value }) =>
      numeral(parseInt(value, 0)).format('0'.repeat(`${max}`.length)),
    ...opts,
  })
}

function floatField(opts = {}) {
  const min = opts.min || 0.0
  const max = opts.max || 0.0
  const precision = opts.precision || 2
  const left = '0'.repeat(`${max}`.length)
  const right = '0'.repeat(precision)
  const mask = `${left}.${right}`
  return {
    defaultValue: ({ context }) => opts.min || 0,
    format: ({ value }) => numeral(parseFloat(value)).format(mask),
    mask,
    unmask: ({ value }) => value.replace(/[^\d.]/g, '').replace(/\.$/, ''),
    validate: ({ value }) =>
      parseFloat(value) >= min && parseFloat(value) <= max,
    ...opts,
  }
}

function currencyField(opts = {}) {
  return floatField({
    min: 0,
    max: 1000,
    precision: 2,
    inputLabel: () => '$',
    ...opts,
  })
}

function rateField(opts = {}) {
  return currencyField({
    min: 0,
    max: 5,
    precision: 4,
    ...opts,
  })
}

function phoneField(opts = {}) {
  return {
    mask: '(111) 555-1212',
    unmask: /[^\d]/g,
    validate: /\d{10}/,
    ...opts,
  }
}

function toggleField(opts = {}) {
  return {
    type: 'Toggle',
    defaultValue: false,
    ...opts,
  }
}

function emailField(opts = {}) {
  return textField({
    mask: emailMask,
    validate: ({ value }) =>
      value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ) !== null,
    ...opts,
  })
}

function sectionField(opts = {}) {
  return {
    type: 'Section',
    ...opts,
  }
}

function dropdownField(opts = {}) {
  return {
    type: 'Dropdown',
    ...opts,
  }
}

function divField(opts = {}) {
  return {
    type: 'Div',
    ...opts,
  }
}

function createMask(s) {
  const arr = _.map(s, c => {
    if (c.match(/\d/) !== null) {
      return /\d/
    }
    return c
  })
  return arr
}

export {
  divField,
  dropdownField,
  sectionField,
  emailField,
  toggleField,
  phoneField,
  currencyField,
  rateField,
  quantityField,
  floatField,
  integerField,
  createMask,
}
