class BusinessRuleError extends Error {
  constructor(apiResponse) {
    super('Business rule error')
    this.response = apiResponse
  }

  toString() {
    if (typeof this.response.message === 'string') {
      return this.response.message
    }
    return this.response.message['*'] || 'Multiple field errors'
  }
}

export { BusinessRuleError }
