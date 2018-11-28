import React, { Component } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import { BrowserRouter } from 'react-router-dom'
import { RouteButton } from './RouteButton'
import { RouteRenderer } from './RouteRenderer'

class TabView extends Component {
  state = { tabButtons: [] }

  componentDidMount() {
    const { routes, ...rest } = this.props
    this.setState({
      tabButtons: _.map(routes, (route, k) => {
        const { path, menu } = route
        const { decorators } = menu
        const render = () => (
          <RouteButton key={k} to={route({ ...rest })}>
            {menu.title}
          </RouteButton>
        )
        return React.createElement(
          _.reduce(decorators, (c, d) => d(c), render),
          {
            key: path,
            ...this.props,
          },
        )
      }),
    })
  }

  render() {
    const { routes, ...rest } = this.props
    const { tabButtons } = this.state

    return (
      <div>
        <Button.Group widths="5" style={{ marginBottom: 20 }}>
          {tabButtons}
        </Button.Group>
        <RouteRenderer routes={routes} {...rest} />
      </div>
    )
  }
}

export { TabView }
