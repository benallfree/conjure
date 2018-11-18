import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Menu } from 'semantic-ui-react'
import { routes } from '~/routes'
import { connect } from '~/store'

@connect(({ user }) => ({ user }))
class TopNav extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    this.state = {
      activeItem: match.url,
    }
  }

  handleItemClick = (e, { to }) => this.setState({ activeItem: to })

  render() {
    const { activeItem } = this.state
    const { user } = this.props

    const renderMenuItem = (route, k) => {
      const { path, menu } = route
      if (!menu.middleware({ user })) return null
      const { title, icon } = menu
      return (
        <Menu.Item
          as={Link}
          to={route.path}
          key={path}
          name={title}
          active={activeItem === path}
          onClick={this.handleItemClick}
          icon={icon}
        />
      )
    }

    const items = _.filter(routes, route => typeof route.menu !== 'undefined')
    return (
      <Menu borderless style={{ marginBottom: 20 }}>
        <Menu.Item header as={Link} to="/" onClick={this.handleItemClick}>
          {process.env.APP_NAME}
        </Menu.Item>
        {_.map(
          _.filter(items, route => route.menu.position === null),
          renderMenuItem,
        )}
        <Menu.Menu position="right">
          {_.map(
            _.filter(items, route => route.menu.position === 'right'),
            renderMenuItem,
          )}
        </Menu.Menu>
      </Menu>
    )
  }
}

export { TopNav }
