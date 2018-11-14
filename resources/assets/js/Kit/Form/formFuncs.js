import numeral from 'numeral'
import emailMask from 'text-mask-addons/dist/emailMask'
import _ from 'lodash'

function textField(config = {}) {
  return { ...config }
}

function integerField(config = {}) {
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

function quantityField(config = {}) {
  const min = config.min || 0
  const max = config.max || 1000
  return integerField({
    min,
    max,
    inputLabel: () => 'qty',
    format: ({ value }) =>
      numeral(parseInt(value, 0)).format('0'.repeat(`${max}`.length)),
    ...config,
  })
}

function floatField(config = {}) {
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

function currencyField(config = {}) {
  return floatField({
    min: 0,
    max: 1000,
    precision: 2,
    inputLabel: () => '$',
    ...config,
  })
}

function rateField(config = {}) {
  return currencyField({
    min: 0.0,
    max: 0.05,
    precision: 4,
    ...config,
  })
}

function phoneField(config = {}) {
  return {
    mask: '(111) 555-1212',
    unmask: /[^\d]/g,
    validate: /\d{10}/,
    ...config,
  }
}

function toggleField(config = {}) {
  return {
    type: 'Toggle',
    defaultValue: false,
    ...config,
  }
}

function emailField(config = {}) {
  return textField({
    mask: emailMask,
    validate: ({ value }) => {
      if (!value) return true
      return (
        value.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ) !== null
      )
    },
    ...config,
  })
}

function sectionField(config = {}) {
  return {
    type: 'Section',
    ...config,
  }
}

function dropdownField(config = {}) {
  return {
    type: 'Dropdown',
    ...config,
  }
}

function checklistField(config = {}) {
  return {
    type: 'Checklist',
    defaultValue: info => {
      const { options } = info
      const ret = {}
      _.each(options(info), (v, k) => {
        ret[k] = false
      })
      return ret
    },
    ...config,
  }
}

function divField(config = {}) {
  return {
    type: 'Div',
    ...config,
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
  textField,
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
  checklistField,
}
