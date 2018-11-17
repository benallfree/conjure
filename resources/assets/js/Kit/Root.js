import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import _ from 'lodash'
import { Transition, Message, Container } from 'semantic-ui-react'
import { routes } from '~/routes'
import { TopNav } from './TopNav'
import { ComponentBase, Api } from '~/Kit'
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
      user: Api.getCurrentUser().then(user => {
        actions.setUser(user)
      }),
    }
  }

  renderLoaded() {
    const { message } = this.props
    return (
      <Router>
        <React.Fragment>
          <Route path="*" component={TopNav} />
          <Route path="*" component={NavWatcher} />
          <Container fluid>
            {message && <Message info>{message}</Message>}
            {_.map(routes, r => (
              <Route exact key={r.path} path={r.path} component={r.component} />
            ))}
          </Container>
        </React.Fragment>
      </Router>
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
