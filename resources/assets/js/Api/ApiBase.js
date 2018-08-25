import { ApiError } from './ApiError'
import { BusinessRuleError } from './BusinessRuleError'

class ApiBase {
  get(url) {
    return this.axios({ method: 'get', url })
  }

  post(url, data) {
    return this.axios({ method: 'post', url, data })
  }

  async axios(config) {
    try {
      console.log('API', config)
      const response = await axios(config)
      console.log('api success', response)
      const apiResponse = response.data

      if (!apiResponse.status)
        throw new ApiError(
          `Invalid response - no Status detected - ${config.method}:${
            config.url
          }`,
        )
      if (apiResponse.status === 'error') {
        throw new BusinessRuleError(apiResponse)
      }
      return apiResponse.data
    } catch (e) {
      if (
        e.response &&
        e.response.status === 401 &&
        e.response.data &&
        e.response.data.message === 'Unauthenticated.'
      ) {
        if (this.onNeedsAuthentication) {
          await this.onNeedsAuthentication()
          return this.axios(config)
        }
        throw new ApiError(
          'Unauthenticated and no onNeedsAuthentication handler defined.',
        )
      }
      const msg = `API ERROR: ${e}`
      console.error(msg)
      throw e
    }
  }

  async ping() {
    const response = await this.get(route('api.ping'))
    return response
  }
}

export { ApiBase }
