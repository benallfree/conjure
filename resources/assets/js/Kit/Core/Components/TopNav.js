import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Menu } from 'semantic-ui-react'

const MenuItemGroup = props => {
  const { position, routes, activeItem } = props

  return _.map(
    _.filter(routes, ({ menu }) => menu.position === position),
    route => {
      const { menu, fullPath } = route
      const { decorators, title, icon } = menu
      const MenuItem = _.reduce(decorators, (c, d) => d(c), Menu.Item)
      return (
        <MenuItem
          as={Link}
          to={route()}
          name={title}
          active={route.match(props, activeItem)}
          icon={icon}
          key={fullPath}
        />
      )
    },
  )
}

const TopNav = props => {
  const { match, routes } = props
  const menuRoutes = _.filter(routes, ({ menu }) => typeof menu !== 'undefined')
  return (
    <Menu borderless style={{ marginBottom: 20 }}>
      <Menu.Item header as={Link} to={routes.home()}>
        {process.env.APP_NAME}
      </Menu.Item>
      <MenuItemGroup
        routes={menuRoutes}
        position={null}
        activeItem={match.url}
      />
      <Menu.Menu position="right">
        <MenuItemGroup
          routes={menuRoutes}
          position="right"
          activeItem={match.url}
        />
      </Menu.Menu>
    </Menu>
  )
}

export { TopNav }
