import { text } from './text'

function phone(config = {}) {
  return text({
    mask: '(111) 555-1212',
    icon: 'phone',
    unmask: /[^\d]/g,
    validate: /\d{10}/,
    type: 'Phone',
    ...config,
  })
}

export { phone }
