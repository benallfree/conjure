import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import _ from 'lodash'
import { RouteRenderer } from './RouteRenderer'

class RouteProxy extends Component {
  render() {
    const { route } = this.props
    return <RouteRenderer routes={route.routes} />
  }
}

export { RouteProxy }
