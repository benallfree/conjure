class BusinessRuleError extends Error {
  constructor(apiResponse) {
    super('Business rule error')
    this.response = apiResponse
  }
}

export { BusinessRuleError }
