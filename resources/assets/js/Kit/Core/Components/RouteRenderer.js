import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import _ from 'lodash'

class RouteRenderer extends Component {
  state = { routes: [] }

  componentDidMount() {
    const { routes, ...rest } = this.props
    this.setState({
      routes: _.map(routes, (r, key) => {
        const params = {
          exact: _.keys(r.routes).length === 0,
          key,
          path: r.fullPath,
          render: props => {
            return React.createElement(r.component, {
              ...this.props,
              ...props,
              route: r,
            })
          },
        }
        return <Route {...params} />
      }),
    })
  }

  render() {
    const { routes } = this.state
    return routes
  }
}

export { RouteRenderer }
