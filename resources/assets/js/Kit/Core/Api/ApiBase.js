import _ from 'lodash'
import moment from 'moment'
import { ApiError } from './ApiError'
import { BusinessRuleError } from './BusinessRuleError'

class ApiBase {
  route(path, args = {}) {
    const finalArgs = {}
    _.each(args, (v, k) => {
      if (moment.isMoment(v)) {
        finalArgs[k] = v.valueOf()
      } else {
        finalArgs[k] = v
      }
    })
    return route(path, finalArgs)
  }

  get(url, context = {}) {
    return this.axios({ method: 'get', url }, context)
  }

  post(url, data, context = {}) {
    return this.axios({ method: 'post', url, data }, context)
  }

  async axios(config, context = {}) {
    try {
      console.log('API Request', config)
      const response = await axios(config)
      console.log('API Response', response)
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
      if (e instanceof BusinessRuleError) {
        throw e
      }
      if (
        e.response &&
        e.response.status === 401 &&
        e.response.data &&
        e.response.data.message === 'Unauthenticated.'
      ) {
        if (this.onNeedsAuthentication) {
          this.onNeedsAuthentication(context)
          throw new ApiError('Unauthenticated.')
        }
        throw new ApiError(
          'Unauthenticated and no onNeedsAuthentication handler defined.',
        )
      }
      let msg = e.toString()
      if (e.response && e.response.data && e.response.data.message) {
        msg = e.response.data.message
      }
      console.error(msg)
      throw new ApiError(`API ERROR: ${msg}`)
    }
  }
}

export { ApiBase }
