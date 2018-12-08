function phone(config = {}) {
  return {
    mask: '(111) 555-1212',
    unmask: /[^\d]/g,
    validate: /\d{10}/,
    ...config,
  }
}

export { phone }
