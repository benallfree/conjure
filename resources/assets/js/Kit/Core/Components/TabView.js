import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import { RouteButton } from './RouteButton'
import { RouteRenderer } from './RouteRenderer'

const TabView = props => {
  const { route, buttonProps, ...rest } = props

  return (
    <div>
      <Button.Group style={{ marginBottom: 20 }} {...buttonProps}>
        {_.map(route.routes, (r, k) => {
          const { fullPath, menu } = r
          const { decorators, title } = menu
          const MyButton = _.reduce(decorators, (c, d) => d(c), RouteButton)
          return (
            <MyButton {...rest} key={fullPath} route={r}>
              {title}
            </MyButton>
          )
        })}
      </Button.Group>
      <RouteRenderer {...rest} routes={route.routes} />
    </div>
  )
}

export { TabView }
