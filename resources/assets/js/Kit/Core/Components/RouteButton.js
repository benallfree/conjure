import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import { Route } from 'react-router-dom'

const RouteButton = ({ to, children, route, ...rest }) => {
  const paths = []
  function rGatherPaths(routes) {
    _.each(routes, r => {
      paths.push(r({ ...rest }))
      rGatherPaths(r.routes)
    })
  }
  rGatherPaths({ route })
  return (
    <Route
      render={({ match, location, history }) => {
        return (
          <Button
            active={_.findIndex(paths, p => p === location.pathname) !== -1}
            onClick={() => {
              history.push(to)
            }}
            {...rest}
          >
            {children}
          </Button>
        )
      }}
    />
  )
}
export { RouteButton }
