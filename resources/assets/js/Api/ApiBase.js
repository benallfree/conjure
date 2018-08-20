import { ApiError } from './ApiError'

class ApiBase {
  get(url) {
    return this.axios({ method: 'get', url })
  }

  async axios(config) {
    try {
      console.log('API', config)
      const response = await axios(config)
      console.log('api success', response)
      const apiResponse = response.data
      if (!apiResponse.status)
        throw new Error(
          `Invalid response - no Status detected - ${config.method}:${
            config.url
          }`,
        )
      if (apiResponse.status === 'error') {
        throw new ApiError(apiResponse.message)
      }
      return apiResponse.data
    } catch (e) {
      const msg = `API ERROR: ${e}`
      console.error(msg, e, e.response)
      if (e.response && e.response.message) {
        throw new ApiError(e.response.message)
      }
      throw new ApiError(e)
    }
  }

  async ping() {
    const response = await this.get(route('api.ping'))
    return response
  }
}

export { ApiBase }
