import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import { RouteButton } from './RouteButton'
import { RouteRenderer } from './RouteRenderer'

const TabView = props => {
  const { routes, ...rest } = props
  return (
    <div>
      <Button.Group widths="5" style={{ marginBottom: 20 }}>
        {_.map(routes, (route, k) => {
          const { fullPath, menu } = route
          const { decorators, title } = menu
          const MyButton = _.reduce(decorators, (c, d) => d(c), RouteButton)
          return (
            <MyButton key={fullPath} to={route({ ...rest })} {...rest}>
              {title}
            </MyButton>
          )
        })}
      </Button.Group>
      <RouteRenderer routes={routes} {...rest} />
    </div>
  )
}

export { TabView }
