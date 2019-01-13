import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import _ from 'lodash'
import { Message, Container } from 'semantic-ui-react'
import { subscribe } from 'react-contextual'
import { TopNav, ComponentBase, RouteRenderer, NavWatcher } from './Core'

@subscribe('ioc')
class Root extends ComponentBase {
  loadState() {
    const {
      ioc: { setUser },
    } = this.props
    return {
      user: this.api.getCurrentUser().then(user => {
        setUser(user)
      }),
    }
  }

  renderLoaded() {
    const {
      ioc: { routes, message },
    } = this.props
    return (
      <BrowserRouter>
        <React.Fragment>
          {_.map(routes, (r, key) => {
            if (r.chromeless) return null
            return (
              <Route
                exact={_.keys(r.routes).length === 0}
                key={key}
                path={r.fullPath}
                render={props => <TopNav routes={routes} {...props} />}
              />
            )
          })}
          <Route path="*" component={NavWatcher} />
          <Container fluid>
            {message && <Message info>{message}</Message>}
            <RouteRenderer routes={routes} />
          </Container>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export { Root }
