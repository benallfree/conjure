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
    this.state = { isMounted: false }
    this.watchKeys = []
  }

  componentDidMount() {
    const state = this.loadState()
    this.watchKeys = _.keys(state)
    this.setState({ isMounted: true, ...state })
  }

  setState(obj, cb = null) {
    _.each(obj, (v, k) => {
      if (!(typeof v === 'function' || typeof v.then === 'function')) {
        super.setState({ [k]: v })
        return
      }

      super.setState(
        {
          [k]: {
            ...ASYNC,
            isLoading: true,
          },
        },
        async () => {
          const promise = typeof v === 'function' ? v() : v
          if (!promise || typeof promise.then !== 'function') {
            throw new Error(`${k} must resolve to a promise.`)
          }

          try {
            const response = await promise
            super.setState({
              [k]: {
                ...ASYNC,
                isLoaded: true,
                response,
              },
            })
          } catch (error) {
            console.error(`Error on async '${k}':`, error.message)
            super.setState({
              [k]: {
                ...ASYNC,
                error,
              },
            })
          }
        },
      )
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
    const { isMounted } = this.state
    if (!isMounted) return null
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
