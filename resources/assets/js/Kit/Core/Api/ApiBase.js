import _ from 'lodash'
import moment from 'moment'
import axios, { CancelToken } from 'axios'
import { ApiError } from './ApiError'
import { BusinessRuleError } from './BusinessRuleError'

class ApiBase {
  constructor() {
    this.source = CancelToken.source()
    this.requestCount = 0
    this.isCanceling = false
  }

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

  async axios(pConfig, context = {}) {
    const config = { ...pConfig, cancelToken: this.source.token }
    if (this.isCanceling) {
      throw new ApiError(
        'Canceling requests, no new requests accepted at this time.',
      )
    }
    try {
      console.log('API Request', config)
      this.requestCount += 1
      const response = await axios(config)
      if (this.isCanceling) {
        throw new ApiError('Request canceled')
      }
      this.requestCount -= 1

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
      this.requestCount -= 1
      if (axios.isCancel(e)) {
        throw new ApiError('Request canceled.')
      }
      if (e instanceof BusinessRuleError) {
        throw e
      }
      if (
        e.response &&
        e.response.status === 401 &&
        e.response.data &&
        e.response.data.message === 'Unauthenticated.'
      ) {
        this.handleUnauthenticated(context)
      }
      let msg = e.toString()
      if (e.response && e.response.data && e.response.data.message) {
        msg = e.response.data.message
      }
      console.error(msg)
      throw new ApiError(`API ERROR: ${msg}`)
    }
  }

  cancelAllRequests() {
    this.isCanceling = true
    this.source.cancel('All requests canceled.')

    return new Promise(resolve => {
      const timeout = setTimeout(() => {
        clearInterval(interval)
        this.isCanceling = false

        throw new ApiError('Cound not cancel requests')
      }, 1000)
      const interval = setInterval(() => {
        if (this.requestCount > 0) return
        clearInterval(interval)
        clearTimeout(timeout)
        this.isCanceling = false
        this.source = CancelToken.source()

        resolve()
      }, 10)
    })
  }

  handleUnauthenticated(context) {
    if (this.onNeedsAuthentication) {
      this.cancelAllRequests().then(() => {
        this.onNeedsAuthentication(context)
      })
      throw new ApiError('Unauthenticated.')
    }
    throw new ApiError(
      'Unauthenticated and no onNeedsAuthentication handler defined.',
    )
  }
}

export { ApiBase }
