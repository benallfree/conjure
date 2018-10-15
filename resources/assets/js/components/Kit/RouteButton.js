import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import { Route } from 'react-router-dom'

const RouteButton = ({ to, children, ...rest }) => (
  <Route
    component={({ location, history }) => (
      <Button
        active={location.pathname.startsWith(to)}
        onClick={() => {
          history.push(to)
        }}
        {...rest}
      >
        {children}
      </Button>
    )}
  />
)

export { RouteButton }
