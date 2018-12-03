import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import { Route } from 'react-router-dom'

const RouteButton = props => {
  const { children, route, ...rest } = props
  const to = route(rest, { includeQueryString: false })
  return (
    <Route
      render={({ location, history }) => {
        return (
          <Button
            active={route.match(rest, location.pathname)}
            onClick={() => {
              history.push(to)
            }}
          >
            {children}
          </Button>
        )
      }}
    />
  )
}
export { RouteButton }
