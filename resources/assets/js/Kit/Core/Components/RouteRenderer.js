import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import _ from 'lodash'

const RouteRenderer = props => {
  const { routes } = props
  return _.map(routes, (r, key) => {
    const MyComponent = r.component
    const params = {
      exact: _.keys(r.routes).length === 0,
      key,
      path: r.fullPath,
      render: renderProps => {
        return <MyComponent {...props} {...renderProps} route={r} />
      },
    }
    return <Route {...params} />
  })
}

export { RouteRenderer }
