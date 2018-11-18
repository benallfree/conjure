import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import _ from 'lodash'
import { Message, Container } from 'semantic-ui-react'
import { routes } from '~/routes'
import { TopNav } from './TopNav'
import { ComponentBase } from './ComponentBase'
import { Provider, actions, connect } from '~/store'

class NavWatcher extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged()
    }
  }

  onRouteChanged() {
    actions.setGlobalMessage('')
  }

  render() {
    return null
  }
}

@connect(({ message, user }) => ({ message }))
class Loader extends ComponentBase {
  loadState() {
    return {
      user: this.api.getCurrentUser().then(user => {
        actions.setUser(user)
      }),
    }
  }

  renderLoaded() {
    const { message } = this.props
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route path="*" component={TopNav} />
          <Route path="*" component={NavWatcher} />
          <Container fluid>
            {message && <Message info>{message}</Message>}
            {_.map(routes, (r, idx) => (
              <Route
                exact
                key={`${idx}`}
                path={r.path}
                component={r.component}
              />
            ))}
          </Container>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

class Root extends Component {
  render() {
    return (
      <Provider>
        <Loader />
      </Provider>
    )
  }
}

export { Root }
