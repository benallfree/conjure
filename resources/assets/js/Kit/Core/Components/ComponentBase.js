import React, { Component } from 'react'
import _ from 'lodash'
import queryString from 'query-string'
import { Async } from './Async'

class ComponentBase extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.watchKeys = []
    this.privateIsMounted = false
    this.api = new Proxy(props.ioc.Api, {
      get: (target, propKey, receiver) => {
        return (...args) => {
          return target[propKey](...args, this.props)
        }
      },
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location && this.props.match) {
      const values = queryString.parse(this.props.location.search)
      _.merge(this.props.match.params, values)
    }
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

  setState(obj, cb = () => {}) {
    const promiseKeys = []
    const newState = _.reduce(
      obj,
      (res, v, k) => {
        if (v && (typeof v === 'function' || typeof v.then === 'function')) {
          promiseKeys.push(k)
          res[k] = {
            ...Async.DEFAULT,
            isLoading: true,
          }
        } else {
          res[k] = v
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
            ...Async.DEFAULT,
            isLoaded: true,
            response,
          }))
          .catch(error => {
            console.error(`Error on async '${k}':`, error.message)
            return {
              ...Async.DEFAULT,
              error,
            }
          })
      })

      Promise.all(promises).then(results => {
        const finalState = {}
        _.each(promiseKeys, (k, i) => {
          finalState[k] = results[i]
        })
        if (this.privateIsMounted)
          super.setState(finalState, () => cb && cb(finalState))
      })
    })
  }

  loadState() {
    return {}
  }

  renderLoaded(data) {
    return (
      <div>
        Default resolver component. Override this. {this.name}
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
        onLoaded={data =>
          this.renderLoaded({
            ..._.reduce(
              this.state,
              (r, v, k) => {
                if (_.find(this.watchKeys, wk => wk === k)) r[k] = v
                return r
              },
              {},
            ),
            ...data,
          })
        }
      />
    )
  }

  asyncState(k) {
    if (typeof this.state[k] === 'undefined') return Async.DEFAULT
    return this.state[k]
  }

  setAsyncState(newSate) {
    const finalState = _.reduce(
      newSate,
      (r, v, k) => {
        r[k] = { ...this.asyncState(k), response: v }
        return r
      },
      {},
    )
    this.setState(finalState)
  }
}

export { ComponentBase }
