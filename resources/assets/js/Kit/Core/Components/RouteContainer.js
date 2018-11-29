import React, { Component } from 'react'
import { RouteRenderer } from './RouteRenderer'

class RouteContainer extends Component {
  render() {
    return <RouteRenderer {...this.props} routes={this.props.route.routes} />
  }
}

export { RouteContainer }
