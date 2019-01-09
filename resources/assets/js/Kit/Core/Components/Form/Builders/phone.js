import { maskedText } from './maskedText'

function phone(config = {}) {
  return maskedText({
    mask: '(111) 555-1212',
    icon: 'phone',
    validate: /\d{10}/,
    type: 'Phone',
    ...config,
  })
}

export { phone }
