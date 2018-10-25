import React, { Component } from 'react'
import _ from 'lodash'
import queryString from 'query-string'
import { Async } from './Async'

const ASYNC = {
  isLoading: false,
  isLoaded: false,
  error: null,
  response: null,
}

class ComponentBase extends Component {
  constructor(props) {
    super(props)
    if (this.props.location && this.props.match) {
      const values = queryString.parse(this.props.location.search)
      _.merge(this.props.match.params, values)
    }
    this.state = {}
    this.watchKeys = []
    this.privateIsMounted = false
  }

  componentWillUnmount() {
    this.privateIsMounted = false
  }

  componentDidMount() {
    this.privateIsMounted = true
    const state = this.loadState()
    this.watchKeys = _.keys(state)
    this.setState(state)
  }

  setState(obj, cb = null) {
    const promiseKeys = []
    const newState = _.reduce(
      obj,
      (res, v, k) => {
        if (!(typeof v === 'function' || typeof v.then === 'function')) {
          res[k] = v
        } else {
          promiseKeys.push(k)
          res[k] = {
            ...ASYNC,
            isLoading: true,
          }
        }
        return res
      },
      {},
    )
    super.setState(newState, () => {
      const promises = _.map(promiseKeys, (k, i) => {
        const v = obj[k]
        const promise = typeof v === 'function' ? v() : v
        if (!promise || typeof promise.then !== 'function') {
          throw new Error(`${k} must resolve to a promise.`)
        }
        return promise
          .then(response => ({
            ...ASYNC,
            isLoaded: true,
            response,
          }))
          .catch(error => {
            console.error(`Error on async '${k}':`, error.message)
            return {
              ...ASYNC,
              error,
            }
          })
      })

      Promise.all(promises).then(results => {
        const finalState = {}
        _.each(promiseKeys, (k, i) => {
          finalState[k] = results[i]
        })
        if (this.privateIsMounted) super.setState(finalState, cb)
      })
    })
  }

  loadState() {
    return {}
  }

  renderLoaded(data) {
    return (
      <div>
        Default resolver component. Override this.
        <div>
          <code>{JSON.stringify(data, null, 2)}</code>
        </div>
      </div>
    )
  }

  renderHeader(data) {
    return null
  }

  render() {
    if (!this.privateIsMounted) return null
    const watches = _.reduce(
      this.watchKeys,
      (r, k) => {
        const { [k]: v } = this.state
        if (v && typeof v.isLoading !== 'undefined') r[k] = v
        return r
      },
      {},
    )
    return (
      <Async
        watch={watches}
        onHeader={data => this.renderHeader(data)}
        onLoaded={data => this.renderLoaded(data)}
      />
    )
  }
}

export { ComponentBase, ASYNC }
