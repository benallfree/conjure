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
      return apiResponse
    } catch (e) {
      const msg = `API ERROR: ${e}`
      console.log(msg, e, e.response)
      if (e.response && e.response.data && e.response.data.message) {
        return { status: 'error', error: e.response.data.message }
      }
      return { status: 'error', error: e.message }
    }
  }
}

export { ApiBase }
